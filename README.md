# 📝 할일 관리 앱 (Todo App)

React + Vite로 개발된 할일 관리 애플리케이션입니다.

## ✨ 주요 기능

- ✅ 할일 추가, 수정, 삭제
- ✅ 할일 완료/미완료 토글
- ✅ 우선순위 설정 (낮음, 보통, 높음)
- ✅ 카테고리 분류
- ✅ 마감일 설정
- ✅ 필터링 (전체, 미완료, 완료, 마감임박)
- ✅ 정렬 (최신순, 오래된순, 제목순, 우선순위순, 마감일순)
- ✅ 페이지네이션
- ✅ 반응형 디자인

## 🚀 시작하기

### 1. 프로젝트 클론
```bash
git clone <repository-url>
cd todo-react
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 환경변수 설정
`.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
VITE_API_BASE_URL=https://your-backend-url.com
```

### 4. 개발 서버 실행
```bash
npm run dev
```

### 5. 브라우저에서 확인
`http://localhost:5173` (또는 표시된 포트)에서 앱을 확인할 수 있습니다.

## 🛠️ 사용 기술

- **Frontend**: React 19, Vite 7
- **Styling**: CSS3 (Flexbox, Grid)
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Build Tool**: Vite

## 📁 프로젝트 구조

```
src/
├── components/          # React 컴포넌트
│   ├── TodoControls.jsx    # 할일 컨트롤 (필터, 정렬, 추가 버튼)
│   ├── TodoForm.jsx        # 할일 추가/수정 폼
│   ├── TodoItem.jsx        # 할일 아이템
│   └── TodoList.jsx        # 할일 목록
├── services/           # API 서비스
│   └── api.js             # 백엔드 API 통신
├── App.jsx             # 메인 앱 컴포넌트
├── App.css             # 앱 스타일
├── index.css           # 전역 스타일
└── main.jsx            # 앱 진입점
```

## 🔧 스크립트

- `npm run dev` - 개발 서버 실행
- `npm run build` - 프로덕션 빌드
- `npm run preview` - 빌드된 앱 미리보기
- `npm run lint` - ESLint로 코드 검사

## 📝 라이선스

MIT License
