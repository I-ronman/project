import cv2
from calcData import to_pixel


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