import cv2
from calcData import to_pixel


def draw(img,h,w,l_shoulder,l_hip,l_knee,l_ankle,l_front_foot,l_back_foot):
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
