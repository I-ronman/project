from flask import Flask,jsonify
from flask_socketio import SocketIO,emit
from flask_cors import CORS
import base64
import cv2
import numpy as np
import mediapipe as mp
from calcData import get_angle,draw_angle_arc


good_cnt = 0
bad_cnt = 0



mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils
pose = mp_pose.Pose()




leg_upperbody_parallel = True
stand = False
sit = False
correct_hip_position = True
correct_knee = True
proper_upper_body_tilt = True
center_of_gravity = True

view_center_of_gravity = False
view_upper_body_slope = False
view_leg_hip_angle = False
view_knee_line = False
app = Flask(__name__)
# socket_io = SocketIO(app,cors_allowed_origins="http://192.168.219.89:5173")
socket_io = SocketIO(app,cors_allowed_origins="http://localhost:5173")

class base_line(object):
     def __init__(self,x,y):
        self.x = x,
        self.y = y
     def get(self):
          return self.x,self.y



@socket_io.on('analyze')
def analyze(data):
    global good_cnt
    global bad_cnt
    global leg_upperbody_parallel
    global stand
    global sit
    global correct_hip_position
    global correct_knee
    global proper_upper_body_tilt
    global view_upper_body_slope
    global view_leg_hip_angle
    global center_of_gravity
    global view_center_of_gravity
    viewKnee = data["viewKnee"]
    image_data = data["image"]
    # print(image_data)
    image_bytes = base64.b64decode(image_data.split(',')[1])
    
    frame = cv2.imdecode(np.frombuffer(image_bytes,np.uint8),cv2.IMREAD_COLOR)
    # cv2.imshow('Decoded Image', img)
    # cv2.waitKey(100)
    # cv2.destroyAllWindows()
   
    h,w,_ = frame.shape
    def to_pixel(lm): return int(lm.x * w), int(lm.y * h)
    # def draw_line(a, b, color=(0,255,0)):
    #     cv2.line(frame, to_pixel(a), to_pixel(b), color, 2)
        
    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    result = pose.process(frame_rgb)

    if result.pose_landmarks:
        lm = result.pose_landmarks.landmark
        
        l_leg_ang = get_angle(lm[27],lm[25],lm[23])
        l_hip_ang = get_angle(lm[25],lm[23],lm[11])
        data = {"왼 무릎":l_leg_ang,"왼쪽엉덩이":l_hip_ang}

        # 무릎 나간 각도 구하는 로직
        base_line.y = lm[27].y
        base_line.x = lm[25].x
        knee_over_foot = get_angle(base_line,lm[27],lm[25])
        
        if viewKnee:
            cv2.line(frame,(to_pixel(lm[31])[0],0),to_pixel(lm[31]),(0,255,255),2)
            draw_angle_arc(frame,h,w,base_line,lm[27],lm[25],knee_over_foot,40,(0,255,0))
            cv2.line(frame,(0,to_pixel(lm[27])[1]),to_pixel(lm[27]),(0,255,0),2)
        # 엉덩이 뒤로 빠진 정도 구하는 각도 로직3
        base_line.x = lm[23].x
        base_line.y = lm[27].y
        hip_back = get_angle(base_line,lm[27],lm[23])
        
        # 상체 기울기가 앞으로 너무 많이 쏠리진 않았는지
        base_line.x = lm[11].x
        base_line.y = lm[23].y
        upper_body_angle = get_angle(base_line,lm[23],lm[11])
        if view_upper_body_slope:
            cv2.line(frame,(0,to_pixel(base_line)[1]),to_pixel(lm[23]),(0,255,0),thickness = 10)
            draw_angle_arc(frame,h,w,base_line,lm[23],lm[11],upper_body_angle,40,(0,255,0)) 

        print(f"{data}굿카운트 : {good_cnt} 배드카운트:{bad_cnt}",f"knee_over_foot : {knee_over_foot} hip_back : {hip_back}",f"upper_body : {upper_body_angle}")
        #data,getDistance(lm[23], lm[25]),sit,stand,f"굿카운트 : {good_cnt} 배드카운트:{bad_cnt}",f"knee_over_foot : {knee_over_foot} hip_back : {hip_back}
        
        

        if upper_body_angle < 35: proper_upper_body_tilt = False

        if lm[31].x < lm[25].x and knee_over_foot > 30: correct_knee = False
    
        if hip_back > 50 :correct_hip_position = False

        if l_leg_ang <= 75 and l_hip_ang <= 70 : sit = True
        
        if l_leg_ang - 20 > l_hip_ang or l_hip_ang> l_leg_ang + 20: leg_upperbody_parallel = False

        if sit and l_leg_ang >= 170 and l_hip_ang >= 168: stand = True
                
        if  sit and stand:
            sit = False
            stand = False
            if not correct_knee or not correct_hip_position or not proper_upper_body_tilt or not leg_upperbody_parallel:
                correct_knee = True
                correct_hip_position = True
                proper_upper_body_tilt = True
                leg_upperbody_parallel = True
                bad_cnt += 1
                socket_io.emit("badCount",bad_cnt)
            else:  
                good_cnt += 1
                socket_io.emit("goodCount",good_cnt)


        # cv2.putText(frame, f"{int(r_hip_ang)} ", to_pixel(lm[24]), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
        # cv2.putText(frame, f"{int(l_hip_ang)} ", to_pixel(lm[23]), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
        # cv2.putText(frame, f"count {good_cnt} ", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
        key = cv2.waitKey(5)
        if key == ord("1"): view_upper_body_slope = True if view_upper_body_slope == False else  False
        if key == ord("2"): view_leg_hip_angle = True if view_leg_hip_angle == False else  False

    mp_draw.draw_landmarks(
        frame,
        result.pose_landmarks,
        mp_pose.POSE_CONNECTIONS,
        mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
        mp_draw.DrawingSpec(color=(255,0,0), thickness=2),
    )
        
    







    _, buffer = cv2.imencode('.jpg', frame)
    sendImg = base64.b64encode(buffer).decode("utf-8")
    data = {"sendImg":sendImg}
    socket_io.emit("show",data)



if __name__ == '__main__':
    socket_io.run(app, debug=True, port=525)