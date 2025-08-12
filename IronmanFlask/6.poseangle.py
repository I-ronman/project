import cv2
import mediapipe as mp
import math
from IronmanFlask.exercise.calcData import getAngle,getDistance

mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils

img = cv2.imread('pushup.jpg')


# 전통적인 영상처리를 BGR로 했고, 요즘 우리가 친숙한건 RGB
img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

def get_angle(a, b, c):
    # 세점을 기준으로 두 선(Vector)를 그리고, 해당 백터사이의 각도를 구한다
    # dot product 기반 또는 atan 기반의 수학 함수를 통해서.. 각도를 구할수 있음.
    ang = math.degrees(
        math.atan2(c.y - b.y, c.x - b.x) - math.atan2(a.y - b.y, a.x - b.x)
    )
    return abs(ang)

with mp_pose.Pose(static_image_mode=True) as pose:
    result = pose.process(img_rgb)
    
    if result.pose_landmarks:
        h, w, _ = img.shape
        landmarks = result.pose_landmarks.landmark
        
        # 우리가 원하는 포인트들 좌표값 가져오기
        rightShoulder = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER]
        leftShoulder = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER]
        elbow = landmarks[mp_pose.PoseLandmark.RIGHT_ELBOW]
        wrist = landmarks[mp_pose.PoseLandmark.RIGHT_WRIST]
        hip = landmarks[mp_pose.PoseLandmark.RIGHT_HIP]
        knee = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE]
        ankle = landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE]
        rShoulder2elbow = getDistance(rightShoulder,elbow)
        wrist2elbow = getDistance(wrist,elbow)
        rShoulder2wrist = getDistance(wrist,rightShoulder)
        print(landmarks)
        print(f"rightShoulder : {rightShoulder} \n leftShoulder: {leftShoulder}")
        print(type(rightShoulder))
        print(getAngle(rShoulder2elbow,wrist2elbow,rShoulder2wrist))
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
