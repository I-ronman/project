from flask import Flask,jsonify
from flask_socketio import SocketIO, send
from flask_cors import CORS
import base64

app = Flask(__name__)
socket_io = SocketIO(app)
CORS(app,resources={r'*': {'origins': 'localhost:923'}})

@socket_io.on('analyze')
def analyze(data):
    image_data = data['image']
    print(image_data)
    image_bytes = base64.b64decode(image_data.split(',')[1])



if __name__ == '__main__':
    socket_io.run(app, debug=True, port=525)