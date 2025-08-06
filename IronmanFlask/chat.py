import openai
from dotenv import load_dotenv
import os
import base64
from flask import Flask,request
from flask_socketio import SocketIO
from flask_cors import CORS,cross_origin
import pymysql
from collections import deque
db = pymysql.connect(
	host='project-db-cgi.smhrd.com',
    port=3307,
    user='CGI_25IS_CLOUD_P3_1',
    passwd='smhrd1',
    db='CGI_25IS_CLOUD_P3_1',
    charset='utf8'
)
cursor = db.cursor()
load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')

client = openai.OpenAI(api_key=openai_api_key)

app = Flask(__name__)
CORS(app, origins =['http://localhost:5173'])
# socket_io = SocketIO(app,cors_allowed_origins="http://192.168.219.89:5173")


chat_history = deque([
    {"role": "system", "content": "예~"}
],maxlen=15)

chat_prompt = """너는 집에서 할 수 있는 맨몸운동 루틴을 짜주는 전문 헬스트레이너야. 운동과 관련된 대화만 가능하고 그 이외의 내용에 대한 답변은 절대 하지마.
ACSM's Guidelines for Exercise Testing and Prescription과
WHO Guidelines on Physical Activity and Sedentary Behaviour를 기반으로 루틴을 구성해야해. 
운동 루틴 구성 5대 요소 (FITT-VP 원칙):
Frequency (빈도): 주 몇 회?

Intensity (강도): 심박수, RPE(자각운동강도) 등으로 측정

Time (시간): 운동 지속 시간

Type (유형): 유산소, 근력, 유연성 등

Volume (운동량): 주간 총 시간이나 총 에너지 소비량

이게 기본이야. 
루틴 구성 전에 회원 정보 필수 고려사항들을 순차적으로 질문해.

1. 목표 체형
근육질 몸매라던지, 슬림한 근육이라던지, 마른 몸, 넓은 어깨 등등.
2. 신체에 불편한 곳(질병 등)
예시로 장애 유무,고혈압,당뇨,관절질환, 심장 질환 등등 질병이나 부상에 대한 질문을 해야해.
그리고 운동 수행에 지장이 가는 질환을 가지고 있을 시 운동 난이도를 조금 낮게 루틴을 짜고 
재활이 필요한 질환일 경우 재활을 위한 운동 위주로 짜줘.
3. 생활 패턴이나 운동 가능 시간
하루에 몇시간정도 운동 가능한지 질문해.
4. 목표 기간.
원하는 목표까지 걸리는 기간에 대해서도 질문해.

질문에 대한 답을 했을 때만 다음 질문으로 넘어가고 그 이외의 질문에는 '운동루틴 건강 이외에 대한 질문에 대해서는 대답할수가 없어용😁'이라고 말해줘.
마지막 질문에 대한 답을 들었다면 수집한 정보들을 토대로 루틴을 짜주고 루틴 내에 운동 이름,
세트 수, 한세트 내 운동 횟수, 세트간 휴식시간을 구성하면 돼.

"""



def encode_image_to_base64(image_path):
    """이미지를 base64로 인코딩하여 Data URL 형식으로 반환"""
    with open(image_path, "rb") as image_file:
        base64_bytes = base64.b64encode(image_file.read()).decode("utf-8")
        return f"data:image/png;base64,{base64_bytes}"

def analyze_pose_with_image(img, question):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "당신은 스포츠센터 헬스케어 트레이너 입니다. 운동 자세를 전문적으로 분석해서 피드백을 주세요."
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": question
                    },
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": img
                        }
                    }
                ]
            }
        ],
        max_tokens=1000
    )

    return response.choices[0].message.content
def make_routine(question):
    chat_history.append({"role":"user","content": f"{question}"})
    chat_history.popleft()
    chat_history.appendleft({
        "role": "system",
        "content": chat_prompt
        })
    
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=list(chat_history),
        max_tokens=1000
    )
    chat_history.popleft()
    chat_history.popleft()
    chat_history.append({"role":"assistant", "content":f"{response}"})
    chat_history.appendleft({
        "role": "system",
        "content": chat_prompt
        })
    return response.choices[0].message.content

@app.route("/chat")
def chat(text):
    result = make_routine(text)

    return {"result":result}

@app.route("/short_feed", methods=['POST','OPTIONS'])
@cross_origin(origins="http://localhost:5173")
def short_feed():
    data = request.get_json()
    img = data.get('image')
    question = f"이 운동의 이름은 {data.get('exercise')} (이)야 자세를 보고 자세에서 문제점이 있다면 무엇인지 판단하고 지적한 다음 어떻게 개선해야할지 한두마디 정도로 짧게 피드백해줘"
    result = analyze_pose_with_image(img,question)
    print("\nGPT 자세 분석 결과:")
    return {"result":result}

@app.route("/report", methods=['POST','OPTIONS'])
@cross_origin(origins="http://localhost:5173")
def analysis():
    data = request.get_json()
    img = data.get('image')
    question = f"이 운동의 이름은 {data.get('exercise')} (이)야 자세를 분석하고 현재 자세가 어디가 좋은지 어디가 나쁜지 평가해줘."
    result = analyze_pose_with_image(img, question)
    print("\nGPT 자세 분석 결과:")
    print(result)
    sendData = {"result":result,"img":img}

    return sendData

if __name__ == '__main__':
    app.run( debug=True, port=456)