# mood-backend

오늘 기분 기록기의 NestJS 백엔드입니다. DB는 SQLite 방식(libSQL)을 쓴니다.

```bash
npm install
npm start   # http://localhost:4000
```

## DB 설정 (환경변수)
- 아무것도 설정하지 않으면 로컬 파일 `moods.db`를 씁니다. (배포 환경에서는 재시작 시 사라질 수 있음)
- 배포용: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` 을 설정하면 Turso 외부 DB에 저장되어 기록이 유지됩니다.
- `PORT`: 호스팅이 정해주는 포트를 사용합니다. (기본 4000)
- Render에서는 `NODE_VERSION=22` 이상을 권장합니다.

## API
- `GET /moods?month=2026-10` : 해당 월의 기록
- `GET /moods?limit=30` : 최근 기록
- `POST /moods` : `{ "date": "YYYY-MM-DD", "mood": 1~5, "note": "선택" }` (하루 하나, 같은 날은 덮어씀)
