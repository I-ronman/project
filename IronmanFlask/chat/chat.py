import openai
from dotenv import load_dotenv,find_dotenv
import os
import base64,io
from flask import Flask,request,jsonify
from flask_socketio import SocketIO
from flask_cors import CORS,cross_origin
import pymysql
from collections import deque
from user_answer import user_answer
import json
from google.cloud import texttospeech

db = pymysql.connect(
	host='project-db-cgi.smhrd.com',
    port=3307,
    user='CGI_25IS_CLOUD_P3_1',
    passwd='smhrd1',
    db='CGI_25IS_CLOUD_P3_1',
    charset='utf8'
)
cursor = db.cursor()
load_dotenv(find_dotenv(), override=True)

openai_api_key = os.getenv('OPENAI_API_KEY')
p = (os.getenv("GOOGLE_APPLICATION_CREDENTIALS") or "").strip().strip('"').strip("'")
if p:
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = p
client = openai.OpenAI(api_key=openai_api_key)

tts_client = texttospeech.TextToSpeechClient()

app = Flask(__name__)
CORS(app, origins =['http://localhost:5173'])
# socket_io = SocketIO(app,cors_allowed_origins="http://192.168.219.89:5173")

user_answer = user_answer()

chat_history = deque([
    {"role": "system", "content": "예~"},
    {'role':"assistant","content": "안녕하세요. 루틴 생성을 도와드리는 챗봇입니다. 원하시는 목표 체형이 무엇인지 알려주세요."}
],maxlen=15)

sql = """
SELECT exercise_name, expected_calorie, part FROM exercise
 """

cursor.execute(sql) # SQL 쿼리문 실행
exercises = cursor.fetchall()
db.commit() # DB 변경사항 반영
cursor.execute("SELECT height,weight,activity_level,plank,pliability,push_up,squat,goal_weight,workout_frequency FROM user_info WHERE user_info_id = 4")
user_info = cursor.fetchall();
print(user_info)
db.commit()



chat_prompt = f"""너는 집에서 할 수 있는 맨몸운동 루틴을 짜주는 전문 헬스트레이너야. 
우리 서비스에서 이용할 수 있는 운동은 {exercises}이것들 밖에 없고 (('운동이름',예상칼로리,'운동부위'),('운동이름',예상칼로리,'운동부위')) 구조의 데이터야 해당 운동들로만 루틴을 구성할 수 있어.
그리고 현재 대화중인 사용자의 정보는 {user_info}이고 데이터 구조는 ((키,몸무게,활동량,플랭크 수행력,유연성,팔굽혀펴기 수행능력,스쿼트 수행 능력,목표몸무게,주당 운동일수))야 이 데이터들도 고려해서 루틴을 짜야해.
운동과 관련된 대화만 가능하고 그 이외의 내용에 대한 답변은 절대 하지마.
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



# 1. 신체에 불편한 곳(질병 등) 유무
# 예) 장애 유무,고혈압,당뇨,관절질환, 심장 질환 등등 질병이나 부상에 대한 질문을 해야해.

# 그리고 운동 수행에 지장이 가는 질환을 가지고 있을 시 운동 난이도를 조금 낮게 루틴을 짜고 
# 재활이 필요한 질환일 경우 재활을 위한 운동 위주로 짜줘.

# 2. 하루 최대 운동 가능 시간.
# 하루에 몇시간정도 운동 가능한지 질문해.

# 3. 목표 기간.
# 원하는 목표까지 걸리는 기간에 대해서도 질문해.



질문에 대한 답을 했을 때 약간의 공감을 해.
루틴 구성시 가장 최우선이 돼야 하는 건 사용자의 목표야. 예를 들어 몸무게 감량이 많이 필요하면 유산소위주의 운동이 들어가야 하고
원하는 체형이 있다면 그 체형을 달성하기 위한 루틴들로 구성해야해. 복근을 원하면 코어 운동 위주로 등 근육을 원하면 등운동 위주로.

마지막 질문에 대한 답을 들었다면 수집한 정보들을 토대로 루틴을 짜주고 요일이 들어가서는 안돼.
루틴 이름:
 - 운동이름:
    - 세트수:
    - 한세트 내 운동 횟수:
    - 세트당 운동 수행 시간:
    - 세트간 휴식시간:
 - 운동이름:
    - 세트수:
    - 한세트 내 운동 횟수:
    - 세트당 운동 수행 시간:
    - 세트간 휴식시간:

이런 구조로 추천을 해줘.
그리고 루틴 구성시 ()를 써서도 안되고 ()안에 상세설명 넣거나 그런 건 있으면 안돼.
운동 효과는 루틴 구성 후 맨 마지막 줄에 써줘.

"""

def synthesize_tts(text: str,
                   language_code: str = "ko-KR",
                   voice_name: str = "ko-KR-Standard-A",
                   speaking_rate: float = 1.0,
                   pitch: float = 0.0,
                   audio_encoding: str = "MP3"):
    """Google TTS로 text를 오디오(base64)로 변환 후 (base64, mime) 반환"""
    if not text or not text.strip():
        return None, None

    synth_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code=language_code,
        name=voice_name
    )

    enc_map = {
        "MP3": texttospeech.AudioEncoding.MP3,
        "LINEAR16": texttospeech.AudioEncoding.LINEAR16,
        "OGG_OPUS": texttospeech.AudioEncoding.OGG_OPUS,
    }
    audio_enc = enc_map.get(audio_encoding.upper(), texttospeech.AudioEncoding.MP3)

    audio_config = texttospeech.AudioConfig(
        audio_encoding=audio_enc,
        speaking_rate=speaking_rate,
        pitch=pitch,
    )

    resp = tts_client.synthesize_speech(
        input=synth_input, voice=voice, audio_config=audio_config
    )

    mime = "audio/mpeg" if audio_enc == texttospeech.AudioEncoding.MP3 else \
           "audio/wav" if audio_enc == texttospeech.AudioEncoding.LINEAR16 else \
           "audio/ogg"

    b64 = base64.b64encode(resp.audio_content).decode("utf-8")
    return b64, mime



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

def chat_short(img, question,exercise):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": f"당신은 스포츠센터 헬스케어 트레이너 입니다. {exercise}의 자세를 보고 문제점이 있다면 짧게 한마디정도로 어디가 어떻고 어떻게 해야할지 피드백해줘  "
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

def check_routine(assitant_message):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "너는 사용자의 내용이 운동 루틴인지 아닌지에 대해 판단하는 봇이야. 루틴 내에 운동 이름,"
                "세트 수, 한세트 내 운동 횟수,세트당 운동 수행 시간, 세트간 휴식시간 대로 구성돼 있다면 'yes'만 아니라면 'no'만 말해"
            },
            {
                "role": "user",
                "content": assitant_message
            }
        ],
        max_tokens=1000
    )
    return response.choices[0].message.content

def check_answer(question,answer):
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": "너는 너가 한 질문에 대해 사용자가 관련된 대답을 했는지 판단하는 역할을 가진 봇이야. 줄임말이나 은어가 나왔을 때 한번 더 생각해보고 의미파악을 해 질문에 관련된 대답을 했다면 'yes'만 말하고 그렇지 않다면 'no'만 말해."
                "나쁜 대답) 추상적이고 구분하기 어려운 대답. 예) 나 휴가철에 해변에 가면 여자들이 다 쳐다 볼만한 몸을 갖고 싶어"
                "좋은 대답) 구체적이거나 한번에 구별하기 좋은 대답.  예)"
                "없다고 대답하면 없는거니까 'yes'라고 말해"
            },
            { 
                "role":"assistant",
                "content":question
             },
            {
                "role": "user",
                "content": answer
                
                    
                
            }
        ],
        max_tokens=1000
    )

    return response.choices[0].message.content

def routine_parsing(data):
    print(data)
    response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "user", "content": data}
    ],
    functions = [
        {
            "name": "make_routine",
            "description": "루틴 정보를 생성합니다.",
            "parameters": {
                "type": "object",
                "properties": {
                    "루틴 이름": {"type": "string"},
                    "루틴내 운동": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "운동 이름": {"type": "string"},
                                "세트 수": {"type": "integer"},
                                "운동 횟수": {"type": "integer"},
                                "세트당 운동시간": {"type": "string"},
                                "휴식시간": {"type": "string"}
                            },
                            "required": ["운동 이름", "세트 수", "운동 횟수", "세트당 운동시간", "휴식시간"]
                        }
                    }
                },
                "required": ["루틴 이름", "루틴내 운동"]
            }
        }
    ]
    
    )
    return json.loads(response.choices[0].message.function_call.arguments)


def make_routine(question):
    print(chat_history[-1])
    check = check_answer(chat_history[-1]["content"],question)
    print(check)
    if check == 'yes':
        chat_history.append({"role":"user","content": f"{question}"})
        chat_history.popleft()
        chat_history.appendleft({
            "role": "system",
            "content": chat_prompt
            })
        
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=list(chat_history),
            max_tokens=2000
        )
        chat_history.popleft()
        chat_history.popleft()
        chat_history.append({"role":"assistant", "content":f"{response.choices[0].message.content}"})
        chat_history.appendleft({
            "role": "system",
            "content": chat_prompt
            })
        yes_or_no = check_routine(response.choices[0].message.content)
        if yes_or_no == "yes":
            data = routine_parsing(response.choices[0].message.content)
            print(data)
            return [response.choices[0].message.content,data]
        else: 
            
            return [response.choices[0].message.content,]
    else:
        return [chat_history[-1]["content"],]

@app.route("/chat",methods = ['POST','OPTIONS'])
@cross_origin(origins="http://localhost:5173")
def chat():

    data = request.get_json()
    text = data.get("message")
    result = make_routine(text)
    print(result)
    return jsonify(result=result)


@app.route("/short_feed", methods=['POST','OPTIONS'])
@cross_origin(origins="http://localhost:5173")
def short_feed():
    try:
        data = request.get_json()
        img = data.get('image')
        question = "자세를 보고 자세에서 문제점이 있다면 무엇인지 판단하고 지적한 다음 어떻게 개선해야할지 한마디 정도로 짧게 피드백해줘 "
        "예) 좀 더 깊이 앉으세요. 엉덩이를 더 뒤로 빼세요. 무릎이 너무 앞으로 나갔어요. 어깨 무게 중심이 무너졌어요."
        result = chat_short(img,question,{data.get('exercise')})
        tts_opts = data.get("tts", {}) or {}
        voice_name = tts_opts.get("voiceName", "ko-KR-Standard-A")
        speaking_rate = float(tts_opts.get("speakingRate", 1.0))
        pitch = float(tts_opts.get("pitch", 0.0))
        audio_encoding = tts_opts.get("audioEncoding", "MP3")

        # ✅ Google TTS 합성
        audio_b64, mime = synthesize_tts(
            text=result,
            language_code="ko-KR",
            voice_name=voice_name,
            speaking_rate=speaking_rate,
            pitch=pitch,
            audio_encoding=audio_encoding
        )
        print(result)
        if not audio_b64:
            return jsonify({"error": "TTS 합성 실패"}), 500

        # ✅ 텍스트 + 오디오(base64) 동시 반환
        return jsonify({
            "text": result,
            "audioContent": audio_b64,
            "mimeType": mime
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/report", methods=['POST','OPTIONS'])
@cross_origin(origins="http://localhost:5173")
def analysis():
    data = request.get_json()
    img = data.get('image')
    question = f"이 운동의 이름은 {data.get('exercise')} (이)야 자세를 분석하고 현재 자세가 어디가 좋은지 어디가 나쁜지 평가해줘."
    result = analyze_pose_with_image(img, question)
    # print("\nGPT 자세 분석 결과:")
    # print(result)
    sendData = {"result":result,"img":img}

    return sendData

if __name__ == '__main__':
    app.run( debug=True, port=456)

