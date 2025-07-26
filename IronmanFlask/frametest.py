import cv2
import mediapipe as mp
import math
from calcData import getAngle,getDistance

mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils


for i in range(3):
    img = cv2.imread(f'./hello{i}.png')
    # 전통적인 영상처리를 BGR로 했고, 요즘 우리가 친숙한건 RGB
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    with mp_pose.Pose(static_image_mode=True) as pose:
        result = pose.process(img_rgb)
        
        if result.pose_landmarks:
            h, w, _ = img.shape
            lm = result.pose_landmarks.landmark
            
            # 우리가 원하는 포인트들 좌표값 가져오기
            r_leg_ang = getAngle(getDistance(lm[24], lm[26]), getDistance(lm[26], lm[28]), getDistance(lm[24], lm[28]))  # 오른무릎
            l_leg_ang = getAngle(getDistance(lm[23], lm[25]), getDistance(lm[25], lm[27]), getDistance(lm[23], lm[27]))  # 왼무릎
            r_hip_ang = getAngle(getDistance(lm[12], lm[24]), getDistance(lm[24], lm[26]), getDistance(lm[12], lm[26]))  # 왼무릎
            l_hip_ang = getAngle(getDistance(lm[11], lm[23]), getDistance(lm[23], lm[25]), getDistance(lm[11], lm[25]))  # 왼무릎
            data = {"오른무릎":r_leg_ang,"왼 무릎":l_leg_ang,"오른 엉덩이":r_hip_ang,"왼쪽엉덩이":l_hip_ang}
            print(lm[25].x,lm[31].x)
            # print(shoulder, elbow, wrist, hip, knee, ankle)
            
            # 각도 계산
    #         elbow_angle = get_angle(shoulder, elbow, wrist) # 어께-팔꿈치-손목 사이의 각도
    #         knee_angle = get_angle(hip, knee, ankle) # 엉덩이-무릎-발목 사이의 각도
    #         hip_angle = get_angle(shoulder, hip, knee) # 어께-엉덩이-무릎 사이의 각도
            
    #         print(f"오른쪽 팔꿈치 각도: {elbow_angle:.1f}도")
    #         print(f"오른쪽 무릎   각도: {knee_angle:.1f}도")
    #         print(f"오른쪽 엉덩이 각도: {hip_angle:.1f}도")
            
            # 시각화 하기
            def to_pixel(lm): return int(lm.x * w), int(lm.y * h)
            
            def draw_line(a, b, color=(0,255,0)):
                cv2.line(img, to_pixel(a), to_pixel(b), color, 2)
            
            # draw_line(rightShoulder, elbow)
            # draw_line(elbow, wrist)
            # draw_line(hip, knee)
            # draw_line(knee, ankle)
            # draw_line(rightShoulder, hip)
            
            # cv2.putText(img, f"{int(elbow_angle)} deg", to_pixel(elbow), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            # cv2.putText(img, f"{int(knee_angle)} deg", to_pixel(knee), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            # cv2.putText(img, f"{int(hip_angle)} deg", to_pixel(hip), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0,255,255), 2)
            
            mp_draw.draw_landmarks(
                img,
                result.pose_landmarks,
                mp_pose.POSE_CONNECTIONS,
                mp_draw.DrawingSpec(color=(0, 255, 0), thickness=2, circle_radius=2),
                mp_draw.DrawingSpec(color=(255,0,0), thickness=2),
            )
            

    cv2.imshow("hands", img)
    cv2.waitKey(0)
