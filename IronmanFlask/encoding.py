import base64
import cv2
import numpy as np
def encoding(img):
    _, buffer = cv2.imencode('.jpg', img)
    sendImg = base64.b64encode(buffer).decode("utf-8")
    return sendImg

def decoding(img):
    image_bytes = base64.b64decode(img.split(',')[1])
    
    frame = cv2.imdecode(np.frombuffer(image_bytes,np.uint8),cv2.IMREAD_COLOR)
    return frame