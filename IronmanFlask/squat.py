import cv2
import mediapipe as mp
import csv
from calcData import getDistance, getAngle 

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

cap = cv2.VideoCapture(f"C:/Users/USER/OneDrive/바탕 화면/video/2.mp4")  # 웹캠


stand = False
sit = False

correct_knee = True

while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        h,w,_ = frame.shape
        def to_pixel(lm): return int(lm.x * w), int(lm.y * h)

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(frame_rgb)

        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark

            # 각도 추출 예시 (팔꿈치, 무릎 등)
            # r_arm = getAngle(getDistance(lm[12], lm[14]), getDistance(lm[14], lm[16]), getDistance(lm[12], lm[16]))  # 오른팔
            # l_arm = getAngle(getDistance(lm[11], lm[13]), getDistance(lm[13], lm[15]), getDistance(lm[11], lm[15]))  # 왼팔
            # l_shoulder = getAngle(getDistance(lm[11], lm[13]), getDistance(lm[11], lm[23]), getDistance(lm[13], lm[23]))  # 왼팔
            # r_shoulder = getAngle(getDistance(lm[12], lm[14]), getDistance(lm[12], lm[24]), getDistance(lm[14], lm[24]))  # 왼팔
            r_leg_ang = getAngle(getDistance(lm[24], lm[26]), getDistance(lm[26], lm[28]), getDistance(lm[24], lm[28]))  # 오른무릎
            l_leg_ang = getAngle(getDistance(lm[23], lm[25]), getDistance(lm[25], lm[27]), getDistance(lm[23], lm[27]))  # 왼무릎
            r_hip_ang = getAngle(getDistance(lm[12], lm[24]), getDistance(lm[24], lm[26]), getDistance(lm[12], lm[26]))  # 왼무릎
            l_hip_ang = getAngle(getDistance(lm[11], lm[23]), getDistance(lm[23], lm[25]), getDistance(lm[11], lm[25]))  # 왼무릎
            data = {"오른무릎":r_leg_ang,"왼 무릎":l_leg_ang,"오른 엉덩이":r_hip_ang,"왼쪽엉덩이":l_hip_ang}
            base_line.y = lm[25].y
            base_line.x = lm[31].x
            
            knee_over_foot = getAngle(getDistance(base_line,lm[31]),getDistance(lm[31],lm[25]),getDistance(base_line,lm[25]))
            print(data,getDistance(lm[23], lm[25]),sit,stand,f"굿카운트 : {good_cnt} 배드카운트:{bad_cnt}",f"knee_over_foot : {knee_over_foot}")
            if lm[31].x < lm[25].x and knee_over_foot > 20:
                 correct_knee = False

            if l_leg_ang <= 55 and l_hip_ang <= 60 :
                 sit = True

            if sit and l_leg_ang >= 170 and l_hip_ang >= 170:
                 stand = True
                 
            if  sit and stand:
                sit = False
                stand = False
                if not correct_knee:
                    correct_knee = True
                    bad_cnt += 1
                else:  
                    good_cnt += 1
            
            

            cv2.putText(frame, f"{int(r_hip_ang)} ", to_pixel(lm[24]), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            cv2.putText(frame, f"{int(l_hip_ang)} ", to_pixel(lm[23]), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            cv2.putText(frame, f"count {good_cnt} ", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            
             
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