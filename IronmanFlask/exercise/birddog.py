import cv2
import mediapipe as mp
import csv
from calcData import get_angle,draw_angle_arc
import math
from draw import draw_birddog
import numpy as np
from encoding import encoding,decoding
from base_line import base_line


def beeline(up,beeline,arm_ang,shoulder_ang,hip_ang,leg_ang):
    """ 팔을 기준으로 팔과 반대편 다리가 올라갔을 때 올라갔는지를 판단하고 정렬이 됐는지 판단하는 함수"""
    arr = np.array([arm_ang,hip_ang,shoulder_ang,leg_ang])

    if  up and np.all(arr >= 155):
        return True
    elif beeline : return True
    else: return False

def perfect_beeline(arm_ang,shoulder_ang,hip_ang,leg_ang):
    """ 뻗은 팔과 다리가 몸통과 완벽한 일자인지 판단"""
    arr = np.array([arm_ang,hip_ang,shoulder_ang,leg_ang])

    if  np.all(arr >= 155):
        return True
    else: return False

def check_support(down,support_arm,support_leg):
        if down and (not support_arm or not support_leg):
            return False
        else: return True

def arm_leg_up(up,down,shoulder_ang,hip_ang,leg_ang):
    """ 좌우 번갈을 때 한쪽 팔 반대쪽 다리가 올라갔는지 판단."""
    arr = np.array([hip_ang,shoulder_ang])

    if  not up and np.all(arr > 120) and down:
        up = True
        down = False
    elif leg_ang < 90 and hip_ang < 120 and shoulder_ang < 90:
        down = True
    return up,down


def perpendicular(p1,p2):
    """지지대가 되는 팔과 다리가 지면과 수직에 가까운지 참 거짓 반환"""
    bl = base_line(p1,p2)
    # print(get_angle(bl,p1,p2))
    if get_angle(bl,p1,p2) < 10:
        return True
    else:
        return False
    
    
def twist_body(twist,r_shoulder,l_shoulder,r_hip,l_hip):
    r_hip_ang = get_angle(r_shoulder,r_hip,l_hip)
    l_hip_ang = get_angle(l_shoulder,l_hip,r_hip)
    # print("오른쪽 골반",r_hip_ang,"왼쪽골반",l_hip_ang)
    if (180 - l_hip_ang) > r_hip_ang - 15 and (180 - l_hip_ang) < r_hip_ang + 15 :
        return False
    elif not twist:
        return False
    else: True

class BirddogAnalyzer():
    def __init__(self):
        self.good_cnt = 0
        self.bad_cnt = 0
        self.twist = False
        self.save_cnt = 0
        self.r_beeline = False
        self.l_beeline = False
        self.pose = mp.solutions.pose.Pose()
        self.bad_pose = False
        self.best_pose = False
        self.r_up = False
        self.l_up = False
        self.r_down = True
        self.send_turn = 0
        self.turn = 1
        self.l_down = True
        self.r_before_shoulder_ang = 120
        self.r_before_hip_ang = 120
        self.r_before_leg_ang = 120
        self.r_before_arm_ang = 120
        self.l_before_arm_ang = 120 
        self.l_before_shoulder_ang = 120
        self.l_before_hip_ang = 120
        self.l_before_leg_ang = 120
        self.r_perfect = False
        self.l_perfect = False

    def process_frame(self,frame,view):
        self.bad_pose = False
        self.best_pose =False
        h,w,_ = frame.shape
        
            
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = self.pose.process(frame_rgb)
        
        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark

            l_leg_ang = get_angle(lm[27],lm[25],lm[23])
            r_leg_ang = get_angle(lm[28],lm[26],lm[24])
            l_hip_ang = get_angle(lm[25],lm[23],lm[11])
            r_hip_ang = get_angle(lm[26],lm[24],lm[12])
            r_shoulder_ang = get_angle(lm[24],lm[12],lm[14])
            r_arm_ang = get_angle(lm[12],lm[14],lm[16])
            l_shoulder_ang = get_angle(lm[23],lm[11],lm[13])
            l_arm_ang = get_angle(lm[11],lm[13],lm[15])
            test = {"오른팔":r_arm_ang,"오른어깨":r_shoulder_ang,"왼다리":l_leg_ang,"왼엉덩이":l_hip_ang,"왼팔":l_arm_ang,"왼어깨":l_shoulder_ang,"오른엉덩이":r_hip_ang,"오른다리":r_leg_ang}
            print(test)
            

            
            self.r_up,self.r_down = arm_leg_up(
                self.r_up,
                self.r_down,
                r_shoulder_ang,
                l_hip_ang,
                l_leg_ang
            )
            self.l_up,self.l_down = arm_leg_up(
                self.l_up,
                self.l_down,
                l_shoulder_ang,
                r_hip_ang,
                r_leg_ang
            )

            # 팔,다리 지지 수직인지.
            l_support_arm = perpendicular(lm[11],lm[15])
            r_support_arm = perpendicular(lm[12],lm[16])
            l_support_knee = perpendicular(lm[23],lm[25])
            r_support_knee = perpendicular(lm[24],lm[26])
            # print(f"왼손 지지 {l_support_arm} 오른손 지지 {r_support_arm} 왼다리 지지{l_support_knee} 오른다리 지지 {r_support_knee}")
            
            # if not self.bad_pose:
            #     self.bad_pose = not check_support(self.r_down,r_support_arm,l_support_knee) and not check_support(self.l_down,l_support_arm,r_support_knee)

            
            # print("배드포즈",not check_support(self.r_down,r_support_arm,l_support_knee) and not check_support(self.l_down,l_support_arm,r_support_knee))
            self.r_beeline = beeline(
                self.r_up,
                self.r_beeline,
                r_arm_ang,
                r_shoulder_ang,
                l_hip_ang,
                l_leg_ang
            )
            self.l_beeline = beeline(
                self.l_up,
                self.l_beeline,
                l_arm_ang,
                l_shoulder_ang,
                r_hip_ang,
                r_leg_ang
            )
            self.r_perfect = perfect_beeline(
                r_arm_ang,
                r_shoulder_ang,
                l_hip_ang,
                l_leg_ang
            )
            self.l_perfect = perfect_beeline(
                l_arm_ang,
                l_shoulder_ang,
                r_hip_ang,
                r_leg_ang
            )
            print("오른쪽 퍼펙트",self.r_perfect,"왼쪽퍼펙트",self.l_perfect)
            # 오른쪽 최대 높이 시 일자로 뻗었는지. 체크
            if self.r_up:
                print("send",self.send_turn,"turn",self.turn)
                if r_shoulder_ang >= self.r_before_shoulder_ang -3  or l_hip_ang >= self.l_before_hip_ang -3 :
                    self.r_before_shoulder_ang = r_shoulder_ang
                    self.l_before_hip_ang = l_hip_ang
                elif self.send_turn != self.turn:
                    self.r_before_shoulder_ang = 120
                    self.l_before_hip_ang = 120
                    if not self.r_beeline:
                        self.bad_pose = True
                        self.send_turn = self.turn
                    elif l_support_arm and r_support_knee and self.r_perfect:
                        self.best_pose = True
                        self.send_turn = self.turn

            print("bad",self.bad_pose,"best",self.best_pose)
            
            # 왼쪽 최대 높이시 일자로 뻗었는지. 체크
            if self.l_up:
                if  l_shoulder_ang > self.l_before_shoulder_ang   or r_hip_ang > self.r_before_hip_ang :
                    
                    self.l_before_shoulder_ang = l_shoulder_ang
                    self.r_before_hip_ang = r_hip_ang
                elif self.send_turn != self.turn:
                    self.l_before_shoulder_ang = 120
                    self.r_before_hip_ang = 120
                    print("오른쪽팔지지",r_support_arm,"왼쪽무릎지지",l_support_knee,"왼쪽 일자",self.l_perfect)
                    if not self.r_beeline:
                        self.bad_pose = True
                        self.send_turn = self.turn
                        
                    elif r_support_arm and l_support_knee and self.l_perfect:
                        self.best_pose = True
                        self.send_turn = self.turn
            

            
            draw_birddog(frame,h,w,lm[12],lm[14],lm[16],lm[24],lm[26],lm[28],lm[32],lm[30],lm[11],lm[13],lm[15],lm[23],lm[25],lm[27],lm[31],lm[29],lm[7])
            

            self.twist = twist_body(self.twist,lm[12],lm[11],lm[24],lm[23])
            if self.twist and self.send_turn != self.turn:
                self.bad_pose = True
            print("오른손 올라감",self.r_up,"왼손 올라감",self.l_up,"몸통 비틀어짐",self.twist,"오른쪽 다운",self.r_down,"왼쪽 다운",self.l_down,"오른쪽 일자",self.r_beeline,"왼쪽 일자",self.l_beeline)
            if all([self.r_up,self.l_up]) and self.r_down and self.l_down:
                self.r_up = False
                self.l_up = False
                self.bad_pose = False
                self.best_pose = False
                self.turn += 1
                if self.twist or not self.r_beeline or not self.l_beeline:
                    self.bad_cnt += 1
                    
                    print("나쁜 횟수",self.bad_cnt)
                else:
                    self.good_cnt += 1
                    print("좋은횟수",self.good_cnt)
            sendImg = encoding(frame)  
            # print(self.good_cnt,"나쁜자세",self.bad_cnt)
            return sendImg, {
                "good_cnt": self.good_cnt,
                "bad_cnt": self.bad_cnt,
                "bad_pose":self.bad_pose,
                "best_pose":self.best_pose
            }
        sendImg = encoding(frame)
        return sendImg,{
                "good_cnt": self.good_cnt,
                "bad_cnt": self.bad_cnt,
                "bad_pose":self.bad_pose,
                "best_pose":self.best_pose
            }
