

class user_answer:
    def __init__(self):
        self.goal_body = False
        self.injury_or_disease = False
        self.daily_time = False
        self.goal_duration = False

    def get_question(self):
        if not self.goal_body:
            self.goal_body = True
            return "안녕하세요. 루틴 생성을 도와드리는 챗봇입니다. 원하시는 목표 체형이 무엇인지 알려주세요"
        elif not self.injury_or_disease:
            self.injury_or_disease =True
            return "혹시 신체에 불편한 곳이나 질병이 있으신가요?"
        elif not self.daily_time:
            self.daily_time = True
            return "하루에 최대 얼마나 운동하실 수 있나요?"
        elif not self.goal_duration:
            self.goal_duration = True
            return "목표 달성까지 원하는 기간은 어느 정도인가요?"