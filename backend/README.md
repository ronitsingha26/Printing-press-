# Printing Press Backend

## Setup

1. Create DB and tables:

```sql
CREATE DATABASE printing_press;
USE printing_press;
-- then run schema.sql
```

2. Copy env:

```bash
cp .env.example .env
```

3. Install + run:

```bash
npm i
npm run dev
```

Backend runs at `http://localhost:5000`.

## API

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET/POST/PUT/DELETE /api/customers`
- `GET/POST/PUT/DELETE /api/jobs` (+ `GET /api/jobs/:id/pdf`)
- `GET/PUT /api/pricing` (+ finishing options CRUD)
- `POST /api/invoices/generate/:jobId` (+ list + pdf)
- `GET /api/reports/daily | /profit | /jobs-summary`

