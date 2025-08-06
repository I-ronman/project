from flask import Flask,jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import base64
import cv2
import numpy as np
import mediapipe as mp
from calcData import get_angle,draw_angle_arc
import socketio
from draw import draw_squat
from encoding import encoding,decoding
from squat import SquatAnalyzer

# 운동 분석기
analyzer_class_map = {
    'squat': SquatAnalyzer
}

analyzer_map = {}


mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils
pose = mp_pose.Pose()


app = Flask(__name__)
# socket_io = SocketIO(app,cors_allowed_origins="http://192.168.219.89:5173")
socket_io = SocketIO(app,cors_allowed_origins="http://localhost:5173")

     

# @app._got_first_request
# def start_socket():
#     threading.Thread(target=init_socket_connection).start()

@socket_io.on('connect')
def handle_connect():
    print('WebSocket 클라이언트 연결됨')

@socket_io.on('disconnect')
def handle_disconnect():
    print('WebSocket 클라이언트 연결 해제됨')

@socket_io.on('analyze')
def analyze(data):
    view = data["view"]
    session_id = data["id"]
    image_data = data["image"]
    frame = decoding(image_data)
    exercise_name = data["exerciseName"]
    
    key = (session_id, exercise_name)

    # 분석기 인스턴스가 없으면 새로 생성
    if key not in analyzer_map:
        analyzer_map[key] = analyzer_class_map[exercise_name]()
    
    analyzer = analyzer_map[key]
    frame, result = analyzer.process_frame(frame,view)
    
    if result["bad_pose"]:
        socket_io.emit("short_feed", frame)
        socket_io.emit("report", ["badPose", frame])
    elif result["best_pose"]:
        socket_io.emit("report", ["bestPose", frame])
    # print(analyzer_map)
    socket_io.emit("show", {"sendImg": frame})
    if result["good_cnt"]:
        socket_io.emit("goodCount",result["good_cnt"])
    if result["bad_cnt"]:
        socket_io.emit("badCount",result["bad_cnt"])

if __name__ == '__main__':
    socket_io.run(app, debug=True, port=525)