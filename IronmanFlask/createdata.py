import cv2
import mediapipe as mp
import csv
from calcData import getDistance, getAngle,get_angle  

mp_pose = mp.solutions.pose
mp_draw = mp.solutions.drawing_utils
pose = mp_pose.Pose()

i = 0
data = []
for i in range(1):
    cap = cv2.VideoCapture(f"video/birddog/birddog_hold.mp4")  # 웹캠
    if i == 0:
        label = "hold"  # 수집하려는 동작 이름
    # if i == 1:
    #     label = "front"  # 수집하려는 동작 이름
    # if i == 2:
    #     label = "side"  # 수집하려는 동작 이름
    # # if i == 3:
    # #     label = "high_shoulder"  # 수집하려는 동작 이름
    # # if i == 4:
    # #     label = "widen_leg"  # 수집하려는 동작 이름
    

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = pose.process(frame_rgb)

        if result.pose_landmarks:
            lm = result.pose_landmarks.landmark

            # 각도 추출 예시 (팔꿈치, 무릎 등)
            r_arm = get_angle(lm[12],lm[14],lm[16])
            l_arm = getAngle(getDistance(lm[11], lm[13]), getDistance(lm[13], lm[15]), getDistance(lm[11], lm[15]))  # 왼팔
            l_shoulder = getAngle(getDistance(lm[11], lm[13]), getDistance(lm[11], lm[23]), getDistance(lm[13], lm[23]))  # 왼팔
            r_shoulder = getAngle(getDistance(lm[12], lm[14]), getDistance(lm[12], lm[24]), getDistance(lm[14], lm[24]))  # 왼팔
            r_leg = getAngle(getDistance(lm[24], lm[26]), getDistance(lm[26], lm[28]), getDistance(lm[24], lm[28]))  # 오른무릎
            l_leg = getAngle(getDistance(lm[23], lm[25]), getDistance(lm[25], lm[27]), getDistance(lm[23], lm[27]))  # 왼무릎
            r_hip = getAngle(getDistance(lm[12], lm[24]), getDistance(lm[24], lm[26]), getDistance(lm[12], lm[26]))  # 왼무릎
            l_hip = getAngle(getDistance(lm[11], lm[23]), getDistance(lm[23], lm[25]), getDistance(lm[11], lm[25]))  # 왼무릎
            
            angle_vector = [{"r_arm":r_arm}, {"l_arm":l_arm}, {"r_leg":r_leg}, {"l_leg":l_leg},{"r_shoulder":r_shoulder},{"l_shoulder":l_shoulder},{"r_hip":r_hip},{"l_hip":l_hip}, label]
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
        if cv2.waitKey(20) & 0xFF == ord('c'):  # q를 누르면 종료
            print("캡쳐시작")
            cv2.imwrite(f"hello{i}.png",frame)
            i += 1
        
            
    cap.release()
    cv2.destroyAllWindows()

    # CSV 저장
with open(f"{label}_data.csv", 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerows(data)