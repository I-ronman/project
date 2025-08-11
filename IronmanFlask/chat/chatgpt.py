# 환경변수파일 (environment variable file = .env 라고 부른다)
# pip install python-dotenv

from dotenv import load_dotenv
import openai
import os

load_dotenv() # .env 파일을 읽어서 메모리에 올림

openai_key = os.getenv('OPENAI_API_KEY')

# print(openai_key)

# OpenAI 와 연동하기 위한 변수를 정의(client 라고 )
client = openai.OpenAI(api_key = openai_key)

# 개발자가 정해둔 구조...
def ask_gpt(message):
    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                # {"role": "system", 'content' : '당신은 환자를 치료하고 질병을 상담하는 의사입니다.'},
                {"role": "system", 'content' : '당신은 IT소프트웨어를 잘 다루는 프로그래머입니다.'},
                { 'role':'user','content':message}
            ],
        )
    
        # print(response.choices[0].message.content)
        return response.choices[0].message.content
    except Exception as e:
        print('오류가 발생했습니다.')
