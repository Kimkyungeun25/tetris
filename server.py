
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os
import sys

# server.py가 있는 위치를 기준으로 정적 파일 제공
PROJECT_DIR = Path(__file__).resolve().parent
HOST = "127.0.0.1"
PORT = 8000


class TetrisHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_DIR), **kwargs)


def main():
    os.chdir(PROJECT_DIR)

    try:
        server = ThreadingHTTPServer((HOST, PORT), TetrisHandler)
    except OSError as error:
        print(f"[오류] 서버를 시작할 수 없습니다: {error}")
        print(f"포트 {PORT}가 이미 사용 중인지 확인해 주세요.")
        sys.exit(1)

    print("=" * 45)
    print("       NEON TETRIS 개발 서버")
    print("=" * 45)
    print(f"프로젝트 경로: {PROJECT_DIR}")
    print(f"접속 주소: http://localhost:{PORT}")
    print("서버 종료: Ctrl + C")
    print("=" * 45)

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
