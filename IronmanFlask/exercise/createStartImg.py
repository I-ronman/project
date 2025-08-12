import cv2
import numpy as np
import os

def imread_rgba(path: str) -> np.ndarray:
    """알파 포함 읽기, 3채널이면 알파 추가"""
    data = np.fromfile(path, dtype=np.uint8)
    img = cv2.imdecode(data, cv2.IMREAD_UNCHANGED)
    if img is None:
        raise FileNotFoundError(path)
    if img.ndim == 2:  # GRAY → BGRA
        img = cv2.cvtColor(img, cv2.COLOR_GRAY2BGRA)
    elif img.shape[2] == 3:  # BGR → BGRA
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
    return img

def imwrite_unicode(path: str, img: np.ndarray) -> None:
    ext = '.' + path.split('.')[-1]
    ok, buf = cv2.imencode(ext, img)
    if not ok:
        raise RuntimeError("이미지 저장 실패")
    buf.tofile(path)

def pad_image_to_fixed_size(input_path: str, output_path: str,
                            target_w: int, target_h: int,
                            align: str = 'center'):
    """
    주어진 크기에 맞춰 업스케일 없이 투명 패딩으로만 채운 후 저장.
    align: center / top / bottom / left / right 조합 가능 (예: 'top-left')
    """
    img = imread_rgba(input_path)
    h, w = img.shape[:2]

    if h > target_h or w > target_w:
        raise ValueError("원본이 타겟보다 큽니다. 잘라내기는 지원하지 않음.")

    canvas = np.zeros((target_h, target_w, 4), dtype=np.uint8)  # 투명 배경

    # 가로 정렬
    if 'left' in align:
        x = 0
    elif 'right' in align:
        x = target_w - w
    else:  # center
        x = (target_w - w) // 2

    # 세로 정렬
    if 'top' in align:
        y = 0
    elif 'bottom' in align:
        y = target_h - h
    else:  # center
        y = (target_h - h) // 2

    canvas[y:y+h, x:x+w] = img
    imwrite_unicode(output_path, canvas)
    print(f"저장 완료: {output_path} ({target_w}x{target_h})")

# ===== 사용 예시 =====
if __name__ == "__main__":
    input_img = r"../image/left_side_standing-removebg.png"
    output_img = r"../image/left_side_standing-removebg.png"
    pad_image_to_fixed_size(input_img, output_img,
                            target_w=1024, target_h=680,
                            align='center')  # 중앙 정렬
