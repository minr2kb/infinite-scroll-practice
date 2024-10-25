# Infinite Scroll 연습

이 프로젝트는 무한 스크롤 기능을 테스트 하기 위한 React 애플리케이션입니다. 서로 다양한 환경애서의 구현을 위해 제작되었습니다.

## 기술 스택

- React 18
- TypeScript
- Chakra UI 3
- Tanstack Query
- Vite

## 시작하기

1. 의존성 설치
   ```bash
   yarn install
   ```
2. 개발 서버 시작
   ```bash
   yarn dev
   ```

## 메인 아이디어

- Intersection observer를 활용하여 직접 제작해보자
- page 단위로 virtualizing을 해주고, 렌더 후 높이를 기억시키자.
- WIP

## TODO

- useInfiniteScroll 분리
- data fetch 관련 변수 입력 받기
- 서로 다른 높이의 카드
- 탭 내의 스크롤 위치 기억하기 -> sessionStorage
- 탭 간 전환시의 스크롤 위치 변경 로직

## 작성자

- 민경배
- kbmin1129@gmail.com
