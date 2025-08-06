import cv2
import numpy as np
import mediapipe as mp
from calcData import get_angle,draw_angle_arc
import socketio
from draw import draw_squat
from encoding import encoding,decoding
from base_line import base_line


class SquatAnalyzer:
    def __init__(self):
        self.send_turn = 0
        self.turn = 0
        self.good_cnt = 0
        self.bad_cnt = 0
        self.leg_upperbody_parallel = True
        self.stand = False
        self.sit = False
        self.correct_knee = True
        self.proper_upper_body_tilt = True
        self.view_upper_body_slope = False
        self.center_of_gravity = True
        self.view_center_of_gravity = False
        self.bad_pose = False
        self.best_pose = False
        self.before_leg_ang = 55
        self.before_upper_body_ang = 35
        self.before_knee_over = 30
        self.before_diff_angle = 25
        self.diff_angle = 25
        self.pose = mp.solutions.pose.Pose()
    def process_frame(self, frame, view):
        if self.best_pose:
            self.best_pose = False
        if self.bad_pose:
            self.bad_pose = False
        h,w,_ = frame.shape
        def to_pixel(lm): return int(lm.x * w), int(lm.y * h)
            
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self.pose.process(frame_rgb)

        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark
            
            # 상체 정강이 평행한지
            self.l_leg_ang = get_angle(lm[27],lm[25],lm[23])
            self.l_hip_ang = get_angle(lm[25],lm[23],lm[11])
            self.diff_angle =abs(self.l_leg_ang - self.l_hip_ang)
            if view["leg_hip_angle"]:
                    draw_angle_arc(frame,h,w,lm[11],lm[23],lm[25],self.l_hip_ang,40,(0,255,0))
                    draw_angle_arc(frame,h,w,lm[23],lm[25],lm[27],self.l_leg_ang,40,(0,255,0))
            if self.diff_angle > 25: 
                self.leg_upperbody_parallel = False
                self.view_leg_hip_angle = True
                if self.diff_angle >= self.before_diff_angle:
                    self.before_diff_angle = self.diff_angle    
                else:
                    self.bad_pose = True
                # print(bad_pose)
            # data = {"왼 무릎":l_leg_ang,"왼쪽엉덩이":l_hip_ang}
        
            # 무릎 나간 각도 구하는 로직
            bl = base_line(lm[31],lm[25])
            knee_over_foot = get_angle(bl,lm[27],lm[25])
            if lm[25].x < lm[31].x and knee_over_foot > 30: 
                self.correct_knee = False
                if knee_over_foot >= self.before_knee_over:
                    self.before_knee_over = knee_over_foot
                else:
                    self.before_knee_over = 30
                    self.bad_pose = True
                    # print(bad_pose)
                view["knee"] = True
            if view["knee"]:
                cv2.line(frame,(to_pixel(lm[31])[0],0),to_pixel(lm[31]),(0,255,255),2)
                draw_angle_arc(frame,h,w,lm[25],lm[31],bl,knee_over_foot,40,(0,255,0))
                cv2.line(frame,(0,to_pixel(lm[27])[1]),to_pixel(lm[27]),(0,255,0),2)

            # 어깨위치 무게중심에 있는지
            front_bl = base_line(lm[31],lm[11])
            
            back_bl = base_line(lm[29],lm[11])
            if (lm[31].x > lm[11].x and get_angle(front_bl,lm[31],lm[11]) > 3) or (lm[29].x < lm[11].x and get_angle(back_bl,lm[29],lm[11]) > 3):
                    self.center_of_gravity = False
                    self.bad_pose = True
                    # print(bad_pose)
            if view["center_of_gravity"]:
                cv2.line(frame,to_pixel(lm[31]),(to_pixel(lm[31])[0],0),(0,255,0),2)
                cv2.line(frame,to_pixel(lm[29]),(to_pixel(lm[29])[0],0),(0,255,0),2)

            # 상체 기울기가 앞으로 너무 많이 쏠리진 않았는지
            bl = base_line(lm[11],lm[23])
            self.upper_body_angle = get_angle(bl,lm[23],lm[11])
            if self.upper_body_angle < 35: 
                self.proper_upper_body_tilt = False
                # view_upper_body_slope = True
                if self.before_upper_body_ang <= self.upper_body_angle:
                    self.before_upper_body_ang = self.upper_body_angle
                else:
                    self.before_upper_body_ang = 35
                    self.bad_pose = True
                    # print(bad_pose)
            if view["upper_body_slope"]:
                cv2.line(frame,(0,to_pixel(bl)[1]),to_pixel(lm[23]),(0,255,0),thickness = 10)
                draw_angle_arc(frame,h,w,bl,lm[23],lm[11],self.upper_body_angle,40,(0,255,0))

            # print(f"diff_angle: {diff_angle} 무릎각도 : {l_leg_ang} 엉덩이 각도: {l_hip_ang} 굿카운트 : {good_cnt} 배드카운트:{bad_cnt}",f"knee_over_foot : {knee_over_foot}",f"upper_body : {upper_body_angle}")
            #data,getDistance(lm[23], lm[25]),sit,stand,f"굿카운트 : {good_cnt} 배드카운트:{bad_cnt}",f"knee_over_foot : {knee_over_foot} hip_back : {hip_back}
            
            if self.l_leg_ang <= 78 and self.l_hip_ang <= 75 : self.sit = True

            if self.sit and self.l_leg_ang >= 165 and self.l_hip_ang >= 165: 
                self.stand = True
                
                    
            if  self.sit and self.stand:
                self.sit = False
                self.stand = False
                self.bad_pose = False
                self.best_pose = False
                # print(f"배드포즈 초기화")
                if not self.correct_knee or not self.proper_upper_body_tilt or not self.leg_upperbody_parallel or not self.center_of_gravity:
                    print(self.correct_knee,self.proper_upper_body_tilt,self.leg_upperbody_parallel,self.center_of_gravity)
                    self.correct_knee = True
                    self.proper_upper_body_tilt = True
                    self.leg_upperbody_parallel = True
                    self.center_of_gravity = True
                    self.bad_cnt += 1
                    # print("bad:",self.bad_cnt)
                else:  
                    self.good_cnt += 1
                    # print("good",self.good_cnt)

        

            draw_squat(frame,h,w,lm[11],lm[23],lm[25],lm[27],lm[31],lm[29])
            
            if self.diff_angle < 5 and self.l_leg_ang < 55:
                if self.before_leg_ang + 2 >= self.l_leg_ang:
                    self.before_leg_ang = self.l_leg_ang
                else:
                    self.before_leg_ang = 55
                    self.best_pose = True


            sendImg = encoding(frame)  
        
            return sendImg, {
                "good_cnt": self.good_cnt,
                "bad_cnt": self.bad_cnt,
                "bad_pose":self.bad_pose,
                "best_pose":self.best_pose
            }
            