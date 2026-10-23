# mood-backend

오늘 기분 기록기의 NestJS 백엔드입니다. 데이터는 SQLite 파일(`moods.db`) 하나에 저장합니다.
Node 22.5 이상의 내장 `node:sqlite`를 쓰므로 DB 패키지는 따로 필요 없습니다.

```bash
npm install
npm start   # http://localhost:4000
```

## API
- `GET /moods?month=2026-10` : 해당 월의 기록
- `GET /moods?limit=30` : 최근 기록
- `POST /moods` : `{ "date": "YYYY-MM-DD", "mood": 1~5, "note": "선택" }` (하루 하나, 같은 날은 덮어씀)
