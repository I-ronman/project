# pip install flask

from flask import Flask,send_from_directory,send_file,request,jsonify

from IronmanFlask.chat.chatgpt import ask_gpt

app = Flask(__name__)

@app.route("/")
def home():
    return send_from_directory("static","index.html")

@app.route("/user")
def user():
    return send_from_directory("static",'user.html')
@app.route("/admin")
def admin():
    return send_from_directory("static",'admin.html')

@app.route("/chat")
def chat():
    return send_from_directory("static","chat.html")

@app.route("/api/ask_question")
def ask_question():
    question = request.args.get("q",None) # 사용자의 요청(request)으로부터 쿼리 파라미터를 
    print("사용자의 질문:",question)
    result = ask_gpt(question)
    print("챗봇의 답변",result)
    return jsonify({"result":result}) # 응답을 json 형태로 반환한다.

if __name__ == "__main__":
    app.run(debug=True) # 디버깅 기능을 켜기(개발자 모드)
    # 배포/운영 환경에서는 절대 디버깅 모드 사용 안됨.