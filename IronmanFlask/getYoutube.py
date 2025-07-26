import yt_dlp

url = 'https://www.youtube.com/shorts/GAkdsDbmZs8'

ydl_opts = {
    'format': 'bestvideo+bestaudio/best',
    'outtmpl': r'C:/Users/USER/OneDrive/바탕 화면/youtube/%(title)s.%(ext)s'
}

with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download([url])  # ← 이 줄이 빠졌던 겁니다!