import openai
from dotenv import load_dotenv
import os
import base64
from flask import Flask
from flask_socketio import SocketIO
import socketio
import threading

load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')

client = openai.OpenAI(api_key=openai_api_key)

app = Flask(__name__)
# socket_io = SocketIO(app,cors_allowed_origins="http://192.168.219.89:5173")
socket_io = SocketIO(app,cors_allowed_origins="http://localhost:525")
ws_client = socketio.Client()

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





@socket_io.on("bestPose")
def analysis(data):
    question = "이 운동 자세에 대해서 평가해줘."
    
    result = analyze_pose_with_image(data, question)
    print("\nGPT 자세 분석 결과:")
    print(result)
    sendData = {"result":result,"img":data}
    ws_client.emit("bestPose",sendData)

if __name__ == '__main__':
    socket_io.run(app, debug=True, port=5001)