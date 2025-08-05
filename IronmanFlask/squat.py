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
        self.before_leg_ang = 55
        self.before_upper_body_ang = 35
        self.before_knee_over = 30
        self.before_diff_angle = 25

    def process_frame(self, frame, viewKnee, view_leg_hip_angle,view_center_of_gravity):
        mp_pose = mp.solutions.pose
        pose = mp_pose.Pose()
        h,w,_ = frame.shape
        def to_pixel(lm): return int(lm.x * w), int(lm.y * h)
            
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        result = pose.process(frame_rgb)

        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark
            
            # 상체 정강이 평행한지
            l_leg_ang = get_angle(lm[27],lm[25],lm[23])
            l_hip_ang = get_angle(lm[25],lm[23],lm[11])
            diff_angle =abs(l_leg_ang - l_hip_ang)
            if view_leg_hip_angle:
                    draw_angle_arc(frame,h,w,lm[11],lm[23],lm[25],l_hip_ang,40,(0,255,0))
                    draw_angle_arc(frame,h,w,lm[23],lm[25],lm[27],l_leg_ang,40,(0,255,0))
            if diff_angle > 25: 
                leg_upperbody_parallel = False
                view_leg_hip_angle = True
                if diff_angle >= before_diff_angle:
                    before_diff_angle = diff_angle    
                else:
                    bad_pose = True
                # print(bad_pose)
            # data = {"왼 무릎":l_leg_ang,"왼쪽엉덩이":l_hip_ang}
        
            # 무릎 나간 각도 구하는 로직
            bl = base_line(lm[31],lm[25])
            knee_over_foot = get_angle(bl,lm[27],lm[25])
            if lm[25].x < lm[31].x and knee_over_foot > 30: 
                correct_knee = False
                if knee_over_foot >= before_knee_over:
                    before_knee_over = knee_over_foot
                else:
                    before_knee_over = 30
                    bad_pose = True
                    # print(bad_pose)
                viewKnee = True
            
            if viewKnee:
                cv2.line(frame,(to_pixel(lm[31])[0],0),to_pixel(lm[31]),(0,255,255),2)
                draw_angle_arc(frame,h,w,lm[25],lm[31],bl,knee_over_foot,40,(0,255,0))
                cv2.line(frame,(0,to_pixel(lm[27])[1]),to_pixel(lm[27]),(0,255,0),2)

            # 어깨위치 무게중심에 있는지
            front_bl = base_line(lm[31],lm[11])
            
            back_bl = base_line(lm[29],lm[11])
            if (lm[31].x > lm[11].x and get_angle(front_bl,lm[31],lm[11]) > 5) or (lm[29].x < lm[11].x and get_angle(back_bl,lm[29],lm[11]) > 5):
                    center_of_gravity = False
                    bad_pose = True
                    # print(bad_pose)
            if view_center_of_gravity:
                cv2.line(frame,to_pixel(lm[31]),(to_pixel(lm[31])[0],0),(0,255,0),2)
                cv2.line(frame,to_pixel(lm[29]),(to_pixel(lm[29])[0],0),(0,255,0),2)

            # 상체 기울기가 앞으로 너무 많이 쏠리진 않았는지
            bl = base_line(lm[11],lm[23])
            upper_body_angle = get_angle(bl,lm[23],lm[11])
            if upper_body_angle < 35: 
                proper_upper_body_tilt = False
                # view_upper_body_slope = True
                if before_upper_body_ang <= upper_body_angle:
                    before_upper_body_ang = upper_body_angle
                else:
                    before_upper_body_ang = 35
                    bad_pose = True
                    # print(bad_pose)
            if view_upper_body_slope:
                cv2.line(frame,(0,to_pixel(bl)[1]),to_pixel(lm[23]),(0,255,0),thickness = 10)
                draw_angle_arc(frame,h,w,bl,lm[23],lm[11],upper_body_angle,40,(0,255,0))

            print(f"diff_angle: {diff_angle} 무릎각도 : {l_leg_ang} 엉덩이 각도: {l_hip_ang} 굿카운트 : {good_cnt} 배드카운트:{bad_cnt}",f"knee_over_foot : {knee_over_foot}",f"upper_body : {upper_body_angle}")
            #data,getDistance(lm[23], lm[25]),sit,stand,f"굿카운트 : {good_cnt} 배드카운트:{bad_cnt}",f"knee_over_foot : {knee_over_foot} hip_back : {hip_back}
            
            if l_leg_ang <= 78 and l_hip_ang <= 75 : sit = True

            if sit and l_leg_ang >= 165 and l_hip_ang >= 165: 
                stand = True
                
                    
            if  sit and stand:
                sit = False
                stand = False
                bad_pose = False
                print(f"배드포즈 초기화")
                turn += 1
                if not correct_knee or not proper_upper_body_tilt or not leg_upperbody_parallel or not center_of_gravity:
                    print(correct_knee,proper_upper_body_tilt,leg_upperbody_parallel,center_of_gravity)
                    correct_knee = True
                    proper_upper_body_tilt = True
                    leg_upperbody_parallel = True
                    center_of_gravity = True
                    bad_cnt += 1
                    print("bad:",bad_cnt)
                    socket_io.emit("badCount",bad_cnt)
                else:  
                    good_cnt += 1
                    print("good",good_cnt)
                    socket_io.emit("goodCount",good_cnt)

        
            # cv2.putText(frame, f"{int(r_hip_ang)} ", to_pixel(lm[24]), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            # cv2.putText(frame, f"{int(l_hip_ang)} ", to_pixel(lm[23]), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            # cv2.putText(frame, f"count {good_cnt} ", (50,50), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            key = cv2.waitKey(5)
            if key == ord("1"): view_upper_body_slope = True if view_upper_body_slope == False else  False
            if key == ord("2"): view_leg_hip_angle = True if view_leg_hip_angle == False else  False

            draw_squat(frame,h,w,lm[11],lm[23],lm[25],lm[27],lm[31],lm[29])
            if bad_pose:
                sendImg = encoding(frame)
                if send_turn != turn:
                    socket_io.emit("short_feed",sendImg)
                    socket_io.emit("report",["badPose",sendImg])
                    send_turn = turn
                    bad_pose = False
                elif diff_angle < 5 and l_leg_ang < 55:
                    sendImg = encoding(frame)
                    if before_leg_ang + 2 >= l_leg_ang:
                        before_leg_ang = l_leg_ang
                    else:
                        before_leg_ang = 55
                        data = ["bestPose",sendImg]
                        socket_io.emit("report",data)

                            
                sendImg = encoding(frame)
                data = {"sendImg":sendImg}
                socket_io.emit("show",data)    
            return frame, {
                "good_cnt": self.good_cnt,
                "bad_cnt": self.bad_cnt,
                "send_turn": self.send_turn,
                "turn": self.turn,
            }
            