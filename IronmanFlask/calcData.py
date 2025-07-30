import math
import cv2

def to_pixel(lm,h,w): return int(lm.x * w), int(lm.y * h)
def getDistance(a,b):
    '''a좌표와 b좌표를 2차원 좌표 값을 토대로 2차원 거리 값을 반환해줍니다.'''
    distance = math.sqrt((a.x-b.x)**2+(a.y-b.y)**2)
    return distance


def getAngle(a,b,c):
    '''삼각형에서 a변과 b변 사이의 각도 값을 구해줍니다.
    이 두 변 사이 각도를 구하기 위해 각도 반대편에 있는 변의 길이가 필요합니다.'''
    cos_C = (a**2 + b**2 - c**2) / (2 * a * b)
    cos_C = max(-1, min(1, cos_C))
    angle_C_rad = math.acos(cos_C)
    angle_C_deg = math.degrees(angle_C_rad)
    return int(angle_C_deg)

def get_angle(a, b, c):
    # 세점을 기준으로 두 선(Vector)를 그리고, 해당 백터사이의 각도를 구한다
    # dot product 기반 또는 atan 기반의 수학 함수를 통해서.. 각도를 구할수 있음.
    ''' ab와 bc 선분 사이의 각도를 구함. b의 각도를 구하는 것'''
    ang = int(math.degrees(
        math.atan2(c.y - b.y, c.x - b.x) - math.atan2(a.y - b.y, a.x - b.x)
    ))
    ang = abs(ang)
    if ang > 180:
        ang = 360 - ang
    return ang

def draw_angle_arc(img,h,w, a, b, c,ang, radius=40, color=(255, 255, 0)):
    """각을 구하기 위해 시작점과 끝점을 위에서부터 아래 순으로 입력"""
     # 방향각 구하기 (OpenCV 기준: 오른쪽 = 0도, 아래 = 90도)
    start = math.degrees(math.atan2(a.y - b.y, a.x - b.x)) % 360
    end   = math.degrees(math.atan2(c.y - b.y, c.x - b.x)) % 360

    # 작은 쪽 각도만 그리기 위해 방향 뒤집기
    sweep = (end - start) % 360
    if sweep < 180:
        if start > end:
            start,end = (start-360),end
    print(sweep)
    print(start,end)
    # 중심 좌표를 픽셀 좌표로 변환
    center = to_pixel(b, h, w)

    # 호 그리기
    cv2.ellipse(
        img,
        center=center,
        axes=(radius, radius),
        angle=0,
        startAngle=start,
        endAngle=end,
        color=color,
        thickness=2
    )

    cv2.putText(img, f'{int(ang)} deg', center,
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)

    