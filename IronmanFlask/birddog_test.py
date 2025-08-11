import cv2
import mediapipe as mp
from IronmanFlask.exercise.calcData import get_angle,draw_angle_arc
import math
from IronmanFlask.exercise.draw import draw_birddog
import numpy as np

class base_line(object):
     def __init__(self,xp,yp):
        self.x = xp.x
        self.y = yp.y
     def get(self):
          return self.x,self.y

good_cnt = 0
bad_cnt = 0

save_cnt = 0

mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils
pose = mp_pose.Pose()

r_beeline = False
l_beeline = False
cap = cv2.VideoCapture("video/birddog/birddog0.mp4")  # 웹캠

twist = False
def beeline(up,beeline,arm_ang,shoulder_ang,hip_ang,leg_ang):
    """ 팔을 기준으로 팔과 반대편 다리가 올라갔을 때 올라갔는지를 판단하고 정렬이 됐는지 판단하는 함수"""
    arr = np.array([arm_ang,hip_ang,shoulder_ang,leg_ang])

    if  up and np.all(arr > 160):
        return True
    elif beeline : return True
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
    if (180 - l_hip_ang) > r_hip_ang - 5 and (180 - l_hip_ang) < r_hip_ang + 5 :
        return False
    elif not twist:
        return False
    else: True

r_up = False
l_up = False
r_down = True
l_down = True

bad_pose = False

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
            r_leg_ang = get_angle(lm[28],lm[26],lm[24])
            l_hip_ang = get_angle(lm[25],lm[23],lm[11])
            r_hip_ang = get_angle(lm[26],lm[24],lm[12])
            r_shoulder_ang = get_angle(lm[24],lm[12],lm[14])
            r_arm_ang = get_angle(lm[12],lm[14],lm[16])
            l_shoulder_ang = get_angle(lm[23],lm[11],lm[13])
            l_arm_ang = get_angle(lm[11],lm[13],lm[15])
            test = {"오른어깨":r_shoulder_ang,"왼다리":l_leg_ang,"왼엉덩이":l_hip_ang,"왼어깨":l_shoulder_ang,"오른엉덩이":r_hip_ang,"오른다리":r_leg_ang}
            print(test)
            

            # print(f"왼손 지지 {l_support_arm} 오른손 지지 {r_support_arm} 왼다리 지지{l_support_knee} 오른다리 지지 {r_support_knee}")
            
            r_up,r_down = arm_leg_up(
                r_up,
                r_down,
                r_shoulder_ang,
                l_hip_ang,
                l_leg_ang
            )
            l_up,l_down = arm_leg_up(
                l_up,
                l_down,
                l_shoulder_ang,
                r_hip_ang,
                r_leg_ang
            )

            # 팔,다리 지지 수직인지.
            l_support_arm = perpendicular(lm[11],lm[15])
            r_support_arm = perpendicular(lm[12],lm[16])
            l_support_knee = perpendicular(lm[23],lm[25])
            r_support_knee = perpendicular(lm[24],lm[26])
            
            if not bad_pose:
                bad_pose = not check_support(r_down,r_support_arm,l_support_knee) and not check_support(l_down,l_support_arm,r_support_knee)

            
            print("배드포즈",bad_pose)

            r_beeline = beeline(
                r_up,
                r_beeline,
                r_arm_ang,
                r_shoulder_ang,
                l_hip_ang,
                l_leg_ang
            )
            l_beeline = beeline(
                l_up,
                l_beeline,
                l_arm_ang,
                l_shoulder_ang,
                r_hip_ang,
                r_leg_ang
            )

            twist = twist_body(twist,lm[12],lm[11],lm[24],lm[23])
            print("오른손 올라감",r_up,"왼손 올라감",l_up,"몸통 비틀어짐",twist,"오른쪽 다운",r_down,"왼쪽 다운",l_down)
            if all([r_up,l_up]) and r_down and l_down:
                r_up = False
                l_up = False
                bad_pose = False
                if twist :
                    bad_cnt += 1
                    
                    print("나쁜 횟수",bad_cnt)
                else:
                    good_cnt += 1
                    print("좋은횟수",good_cnt)


            key = cv2.waitKey(5)
            if key == ord("1"): view_upper_body_slope = True if view_upper_body_slope == False else  False
            if key == ord("2"): view_leg_hip_angle = True if view_leg_hip_angle == False else  False
            if key == ord("3"): view_knee_line = True if view_knee_line == False else  False
            if key == ord("4"): view_center_of_gravity = True if view_center_of_gravity == False else  False



            
           
           
            



            draw_birddog(frame,h,w,lm[12],lm[14],lm[16],lm[24],lm[26],lm[28],lm[32],lm[30],lm[11],lm[13],lm[15],lm[23],lm[25],lm[27],lm[31],lm[29],lm[7])
            
            cv2.imshow('Capture', frame)
            if cv2.waitKey(1) & 0xFF == ord('q'):  # q를 누르면 종료
                break
            if cv2.waitKey(1) & 0xFF == ord('c'):  # q를 누르면 종료
                print("캡쳐시작")
                cv2.imwrite(f"hello{i}.png",frame)
                break
cap.release()
cv2.destroyAllWindows()