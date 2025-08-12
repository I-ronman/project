import cv2
from calcData import to_pixel
import numpy as np


def draw_squat(img,h,w,l_shoulder,l_hip,l_knee,l_ankle,l_front_foot,l_back_foot):
    cv2.circle(img,to_pixel(l_shoulder,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_hip,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_knee,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_ankle,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_front_foot,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_back_foot,h,w),10,(0,255,255),5)

    cv2.line(img,to_pixel(l_shoulder,h,w),to_pixel(l_hip,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_knee,h,w),to_pixel(l_hip,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_ankle,h,w),to_pixel(l_knee,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_ankle,h,w),to_pixel(l_front_foot,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_ankle,h,w),to_pixel(l_back_foot,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_back_foot,h,w),to_pixel(l_front_foot,h,w),(0,127,255),3)


def draw_birddog(img,h,w,r_shoulder,r_elbow,r_wrist,r_hip,r_knee,r_ankle,r_front_foot,r_back_foot,l_shoulder,l_elbow,l_wrist,l_hip,l_knee,l_ankle,l_front_foot,l_back_foot,l_ear):
    
    cv2.circle(img,to_pixel(l_ear,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(r_shoulder,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(r_elbow,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(r_wrist,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(r_hip,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(r_knee,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(r_ankle,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(r_front_foot,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(r_back_foot,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_shoulder,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_elbow,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_wrist,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_hip,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_knee,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_ankle,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_front_foot,h,w),10,(0,255,255),5)
    cv2.circle(img,to_pixel(l_back_foot,h,w),10,(0,255,255),5)

    
    cv2.line(img,to_pixel(l_ear,h,w),to_pixel(l_shoulder,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(r_shoulder,h,w),to_pixel(r_hip,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(r_shoulder,h,w),to_pixel(r_elbow,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(r_elbow,h,w),to_pixel(r_wrist,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(r_knee,h,w),to_pixel(r_hip,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(r_ankle,h,w),to_pixel(r_knee,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(r_ankle,h,w),to_pixel(r_front_foot,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(r_ankle,h,w),to_pixel(r_back_foot,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(r_back_foot,h,w),to_pixel(r_front_foot,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_shoulder,h,w),to_pixel(l_hip,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_shoulder,h,w),to_pixel(l_elbow,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_elbow,h,w),to_pixel(l_wrist,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_knee,h,w),to_pixel(l_hip,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_ankle,h,w),to_pixel(l_knee,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_ankle,h,w),to_pixel(l_front_foot,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_ankle,h,w),to_pixel(l_back_foot,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_back_foot,h,w),to_pixel(l_front_foot,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_hip,h,w),to_pixel(r_hip,h,w),(0,127,255),3)
    cv2.line(img,to_pixel(l_shoulder,h,w),to_pixel(r_shoulder,h,w),(0,127,255),3)

def ensure_bgra(img: np.ndarray) -> np.ndarray:
    if img.ndim == 2:
        return cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
    if img.shape[2] == 3:
        return cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    return img  # 이미 4채널

def overlay_with_alpha(base: np.ndarray, top: np.ndarray, top_alpha_ratio: float = 0.5) -> np.ndarray:
    """
    base 위에 top을 얹습니다. top의 알파를 top_alpha_ratio만큼 더 투명하게 적용 (0~1).
    두 이미지 크기는 같다고 가정.
    Porter–Duff 'over' 블렌딩으로 알파까지 정확히 계산합니다.
    """
    base = ensure_bgra(base).astype(np.float32) / 255.0
    top  = ensure_bgra(top ).astype(np.float32) / 255.0

    # 채널 분리 (정규화된 0~1 범위)
    Bb, Gb, Rb, Ab = cv2.split(base)
    Bf, Gf, Rf, Af = cv2.split(top)

    # top 알파를 비율만큼 더 투명하게
    Af = np.clip(Af * float(top_alpha_ratio), 0.0, 1.0)

    # over 연산
    Aout = Af + Ab * (1.0 - Af)
    # 분모 0 방지
    eps = 1e-6
    Cout_B = (Bf * Af + Bb * Ab * (1.0 - Af)) / (Aout + eps)
    Cout_G = (Gf * Af + Gb * Ab * (1.0 - Af)) / (Aout + eps)
    Cout_R = (Rf * Af + Rb * Ab * (1.0 - Af)) / (Aout + eps)

    out = cv2.merge([
        np.clip(Cout_B, 0, 1),
        np.clip(Cout_G, 0, 1),
        np.clip(Cout_R, 0, 1),
        np.clip(Aout , 0, 1),
    ])
    return (out * 255.0).astype(np.uint8)