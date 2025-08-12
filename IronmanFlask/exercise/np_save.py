# img.npy 파일 만들기
import cv2, numpy as np
img = cv2.imread("./img/left_side_standing.png",cv2.IMREAD_UNCHANGED)
np.save("squat.npy", img)


# 저장된 배열 내용을 Python 코드로 붙여넣기
# (파일 없이도 실행 가능)

