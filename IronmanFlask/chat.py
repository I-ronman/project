import openai
from dotenv import load_dotenv
import os
import base64
from flask import Flask
from flask_socketio import SocketIO
import threading
from flask_cors import CORS
load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')

client = openai.OpenAI(api_key=openai_api_key)

app = Flask(__name__)
CORS(app, resources={r'*': {'origins': 'https://localhost:5173'}})
# socket_io = SocketIO(app,cors_allowed_origins="http://192.168.219.89:5173")


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

@app.route("/short_feed")
def short_feed(img):
    question = "이 운동 자세를 보고 자세에서 가장 큰 문제점이 무엇인지 판단하고 지적한 다음 어떻게 개선해야할지 한두마디 정도로 짧게 피드백해줘"
    result = analyze_pose_with_image(img,question)
    print("\nGPT 자세 분석 결과:")
    return {"img":img,"result":result}

@app.route("report")
def analysis(data):
    question = "이 운동 자세에 대해서 평가해줘."
    
    result = analyze_pose_with_image(data[1], question)
    print("\nGPT 자세 분석 결과:")
    print(result)
    sendData = {"result":result,"img":data[1]}
    # if data[0] == "bestPose":
    #     ws_client.emit("bestPose",sendData)
    # else:
    #     ws_client.emit("badPose",sendData)
    return {"data":data,"result":result}
if __name__ == '__main__':
    app.run(app, debug=True, port=456)