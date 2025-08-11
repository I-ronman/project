import cv2
import mediapipe as mp
import csv
import numpy as np
from IronmanFlask.exercise.calcData import get_angle,draw_angle_arc

class base_line(object):
     def __init__(self,x,y):
        self.x = x,
        self.y = y
     def get(self):
          return self.x,self.y

good_cnt = 0
bad_cnt = 0



mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils
pose = mp_pose.Pose()

cap = cv2.VideoCapture("frontsquat.mp4")  # 웹캠


stand = False
sit = False
shoulder_foot_line = True


view_center_of_gravity = False
view_upper_body_slope = False
view_leg_hip_angle = False
view_knee_line = False
while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        h,w,_ = frame.shape
        def to_pixel(lm): return int(lm.x * w), int(lm.y * h)
        def draw_line(a, b, color=(0,255,0)):
            cv2.line(frame, to_pixel(a), to_pixel(b), color, 2)
            
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(frame_rgb)

        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark

            l_leg_ang = get_angle(lm[27],lm[25],lm[23])
            l_hip_ang = get_angle(lm[25],lm[23],lm[11])
            r_hip_ang = get_angle(lm[26],lm[24],lm[12])
            r_leg_ang = get_angle(lm[24],lm[26],lm[28])
            r_shoulder = lm[12]
            r_shoulder = lm[11]
            r_foot = lm[28]
            l_foot = lm[27]

            hip = np.array([r_hip_ang,l_hip_ang])
            leg = np.array([l_leg_ang,l_leg_ang])
            
            key = cv2.waitKey(5)
            if key == ord("1"): view_upper_body_slope = True if view_upper_body_slope == False else  False
           
            
            
            
            if (hip<150).all() and (leg<100).all(): sit = True

            if sit and (leg>170).all() and (hip>150).all(): stand = True
            
            base_line.x = r_foot.x
            base_line.y = r_shoulder.y
            get_angle(r_shoulder,r_foot,base_line)
            
                 
            if  sit and stand:
                sit = False
                stand = False
                if not shoulder_foot_line :
                    shoulder_foot_line = True
                    bad_cnt += 1
                else:  
                    good_cnt += 1
            print(good_cnt,bad_cnt,sit,stand,hip,leg)

            # cv2.putText(frame, f"{int(r_hip_ang)} ", to_pixel(lm[24]), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            # cv2.putText(frame, f"{int(l_hip_ang)} ", to_pixel(lm[23]), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            # cv2.putText(frame, f"count {good_cnt} ", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)

        mp_draw.draw_landmarks(
            frame,
            result.pose_landmarks,
            mp_pose.POSE_CONNECTIONS,
            mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
            mp_draw.DrawingSpec(color=(255,0,0), thickness=2),
        )
        cv2.imshow('Capture', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):  # q를 누르면 종료
            break
            
cap.release()
cv2.destroyAllWindows()