import cv2
import mediapipe as mp
import csv
from calcData import getDistance, getAngle  # 앞서 만든 각도 함수

mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils
pose = mp_pose.Pose()


for i in range(5):
    cap = cv2.VideoCapture(f"C:/Users/smhrd/Desktop/dataset/back/pushup/{i}.mp4")  # 웹캠
    if i == 0:
        label = "correct"  # 수집하려는 동작 이름
    if i == 1:
        label = "elbow_out"  # 수집하려는 동작 이름
    if i == 2:
        label = "elbow_in"  # 수집하려는 동작 이름
    if i == 3:
        label = "high_shoulder"  # 수집하려는 동작 이름
    if i == 4:
        label = "widen_leg"  # 수집하려는 동작 이름
    data = []

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(frame_rgb)

        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark

            # 각도 추출 예시 (팔꿈치, 무릎 등)
            r_arm = getAngle(getDistance(lm[12], lm[14]), getDistance(lm[14], lm[16]), getDistance(lm[12], lm[16]))  # 오른팔
            l_arm = getAngle(getDistance(lm[11], lm[13]), getDistance(lm[13], lm[15]), getDistance(lm[11], lm[15]))  # 왼팔
            l_shoulder = getAngle(getDistance(lm[11], lm[13]), getDistance(lm[11], lm[23]), getDistance(lm[13], lm[23]))  # 왼팔
            r_shoulder = getAngle(getDistance(lm[12], lm[14]), getDistance(lm[12], lm[24]), getDistance(lm[14], lm[24]))  # 왼팔
            r_leg = getAngle(getDistance(lm[24], lm[26]), getDistance(lm[26], lm[28]), getDistance(lm[24], lm[28]))  # 오른무릎
            l_leg = getAngle(getDistance(lm[23], lm[25]), getDistance(lm[25], lm[27]), getDistance(lm[23], lm[27]))  # 왼무릎
            r_hip = getAngle(getDistance(lm[12], lm[24]), getDistance(lm[24], lm[26]), getDistance(lm[12], lm[26]))  # 왼무릎
            l_hip = getAngle(getDistance(lm[11], lm[23]), getDistance(lm[23], lm[25]), getDistance(lm[11], lm[25]))  # 왼무릎
            
            angle_vector = [r_arm, l_arm, r_leg, l_leg,r_shoulder,l_shoulder,r_hip,l_hip, label]
            data.append(angle_vector)
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

    # CSV 저장
    with open(f"{label}_data.csv", 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data)