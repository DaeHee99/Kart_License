# Kart License

카트라이더 러쉬플러스 기록 측정 및 관리 서비스

## 프로젝트 소개

Kart License는 모바일 레이싱 게임 '카트라이더 러쉬플러스'의 기록을 측정하고 관리하는 웹 서비스입니다. 사용자는 다양한 맵에서의 기록을 입력하고, 티어 등급을 확인하며, 커뮤니티에서 다른 사용자들과 소통할 수 있습니다.

## 주요 기능

### 기록 측정

- 시즌별 맵 기록 입력
- 자동 티어 계산 (강주력, 주력, 1군, 2군, 3군, 4군, 일반)
- 측정 결과 상세 분석

### 결과 공유

- 카카오톡 공유
- QR 코드 카드 다운로드
- 결과 링크 복사

### 커뮤니티

- 게시글 작성/수정/삭제
- 댓글 기능
- 카테고리별 필터링
- 검색 기능
- 무한 스크롤

### 사용자 관리

- 회원가입/로그인
- 프로필 관리 (닉네임, 비밀번호, 프로필 사진)
- 개인 기록 히스토리

### 통계

- 전체 통계 대시보드
- 사용자별 통계
- 티어 분포 분석

### 관리자 기능

- 사용자 관리
- 맵 데이터 초기화
- 측정 로그 조회
- 피드백 관리

## 기술 스택

### Frontend

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI 기반)
- **State Management**: TanStack Query
- **Animation**: Motion
- **Form**: React Hook Form + Zod
- **Rich Text Editor**: TipTap

### Backend

- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT (HTTP-only Cookie)
- **Password Hashing**: bcrypt

### External Services

- Kakao Share API
- Google Analytics

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx            # 홈페이지
│   ├── auth/               # 인증 (로그인/회원가입)
│   ├── measure/            # 기록 측정
│   ├── result/             # 측정 결과
│   ├── records/            # 기록 목록
│   ├── community/          # 커뮤니티
│   ├── statistics/         # 통계
│   ├── mypage/             # 마이페이지
│   ├── userpage/           # 사용자 프로필
│   ├── admin/              # 관리자
│   └── api/                # API 엔드포인트
├── components/             # 공통 컴포넌트
├── lib/
│   ├── db/                 # MongoDB 모델 및 연결
│   ├── services/           # 비즈니스 로직
│   ├── api/                # API 클라이언트
│   ├── middleware/         # 인증 미들웨어
│   └── utils/              # 유틸리티 함수
├── hooks/                  # React 커스텀 훅
└── types/                  # TypeScript 타입 정의
```

## 시작하기

### 요구사항

- Node.js 20+
- pnpm 10+
- MongoDB

### 설치

```bash
# 의존성 설치
pnpm install
```

### 환경 변수

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_KAKAO_JS_SDK_KEY=your_kakao_sdk_key
NEXT_PUBLIC_KAKAO_INTEGRITY=your_kakao_integrity_hash
```

### 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 빌드

```bash
pnpm build
```

### 프로덕션 실행

```bash
pnpm start
```

## 배포

AWS를 통해 배포하여 서비스 운영 중입니다.

[바로가기 링크](https://kartrush.mylicense.kro.kr/)

## 데이터베이스 모델

- **User** - 사용자 계정 및 프로필
- **Record** - 측정 기록 및 티어 정보
- **Post** - 커뮤니티 게시글
- **Comment** - 게시글 댓글
- **Feedback** - 시즌 피드백
- **Log** - 사용자 활동 로그
- **MapData** - 시즌별 맵 정보
- **Announcement** - 공지사항

## API 엔드포인트

### 인증 및 사용자

- `POST /api/user/login` - 로그인
- `POST /api/user/register` - 회원가입
- `POST /api/user/logout` - 로그아웃
- `GET /api/user/auth` - 인증 상태 확인
- `PUT /api/user/update` - 사용자 정보 수정
- `GET /api/user/[id]` - 사용자 정보 조회
- `GET /api/users/[id]` - 공개 프로필 조회

### 기록

- `POST /api/records` - 기록 저장
- `GET /api/records` - 기록 목록
- `GET /api/records/[id]` - 기록 상세
- `GET /api/records/latest` - 최신 기록
- `GET /api/records/recent` - 최근 기록 목록
- `GET /api/records/user/[userId]` - 사용자별 기록
- `GET /api/records/statistics` - 기록 통계
- `GET /api/records/statistics/users` - 사용자별 통계

### 커뮤니티

- `GET /api/posts` - 게시글 목록
- `POST /api/posts` - 게시글 작성
- `GET /api/posts/[id]` - 게시글 상세
- `PUT /api/posts/[id]` - 게시글 수정
- `DELETE /api/posts/[id]` - 게시글 삭제

### 댓글

- `GET /api/posts/[id]/comments` - 댓글 목록
- `POST /api/posts/[id]/comments` - 댓글 작성
- `PUT /api/comments/[id]` - 댓글 수정
- `DELETE /api/comments/[id]` - 댓글 삭제

### 맵 데이터

- `GET /api/maps/latest` - 최신 시즌 맵 데이터
- `POST /api/maps/init` - 맵 데이터 초기화

### 피드백

- `POST /api/feedback` - 피드백 제출
- `GET /api/feedback/statistics` - 피드백 통계

### 통계

- `GET /api/statistics/summary` - 전체 통계 요약
- `GET /api/mypage/data` - 마이페이지 데이터

### 공지사항

- `GET /api/announcements` - 공지사항 목록

### 로그

- `GET /api/logs` - 활동 로그 조회

### 관리자

- `GET /api/admin/stats` - 관리자 통계
- `GET /api/admin/users` - 사용자 관리
- `GET /api/admin/feedbacks` - 피드백 목록
- `GET /api/admin/announcements` - 공지사항 관리
- `POST /api/admin/announcements` - 공지사항 생성
- `PUT /api/admin/announcements/[id]` - 공지사항 수정
- `DELETE /api/admin/announcements/[id]` - 공지사항 삭제
- `GET /api/user/manager/all` - 전체 사용자 목록
- `GET /api/user/manager/[page]` - 페이지별 사용자 목록
- `GET /api/user/manager/find/[name]` - 사용자 검색

## 라이선스

Private Project
