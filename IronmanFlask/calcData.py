import math


def getDistance(a,b):
    '''a좌표와 b좌표를 3차원 좌표 값을 토대로 3차원 거리 값을 반환해줍니다.'''
    distance = math.sqrt((a.x-b.x)**2+(a.y-b.y)**2+(a.z-b.z)**2)
    return distance


def getAngle(a,b,c):
    '''삼각형에서 a변과 b변 사이의 각도 값을 구해줍니다.
    이 두 변 사이 각도를 구하기 위해 각도 반대편에 있는 변의 길이가 필요합니다.'''
    cos_C = (a**2 + b**2 - c**2) / (2 * a * b)
    cos_C = max(-1, min(1, cos_C))
    angle_C_rad = math.acos(cos_C)
    angle_C_deg = math.degrees(angle_C_rad)
    return angle_C_deg