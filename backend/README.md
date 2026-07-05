# 🍽️ Restaurant Reservation Management System — Backend

Enterprise-grade Node.js backend foundation built with Express.js and MongoDB.

---

## 🗂️ Folder Structure & Responsibilities

```
backend/
│
├── src/
│   ├── config/
│   │   └── db.js               → MongoDB connection logic with event listeners & pool config
│   │
│   ├── controllers/
│   │   └── healthController.js → Route handler functions (thin layer — delegates to services)
│   │
│   ├── middleware/
│   │   ├── errorHandler.js     → Centralized error interceptor (always last in chain)
│   │   └── rateLimiter.js      → IP-based request throttling (prevents abuse/DDoS)
│   │
│   ├── models/
│   │   └── index.js            → Mongoose schemas/models (each file = one MongoDB collection)
│   │
│   ├── routes/
│   │   └── health.routes.js    → Route declarations — maps HTTP verbs+paths to controllers
│   │
│   ├── services/
│   │   └── index.js            → Business logic layer (isolated from HTTP — fully testable)
│   │
│   ├── utils/
│   │   ├── ApiError.js         → Custom error class with HTTP statusCode
│   │   ├── ApiResponse.js      → Standardized success response shape
│   │   ├── asyncHandler.js     → Wraps async handlers to auto-forward errors to next()
│   │   └── logger.js           → Timestamped console logger (drop-in for Winston/Pino)
│   │
│   ├── validators/
│   │   └── index.js            → express-validator chains for request body/param validation
│   │
│   └── app.js                  → Express app factory: wires middleware + routes (no server start)
│
├── server.js                   → Entry point: DB connect → HTTP listen → graceful shutdown
├── .env                        → Local environment variables (NOT committed to git)
├── .env.example                → Template showing required variables (IS committed to git)
├── .gitignore                  → Excludes node_modules, .env, logs from version control
└── package.json                → Project metadata, scripts, dependencies
```

---

## 🏗️ Architecture Decisions

### Why `app.js` + `server.js` are separate?
- `app.js` configures Express but never calls `.listen()`
- `server.js` calls `.listen()` after confirming DB is connected
- This allows `app.js` to be imported in **unit/integration tests** without binding to a real port

### Why the service layer?
- Controllers only handle HTTP (parse request → call service → send response)
- Services contain all business rules — **zero Express imports**
- Business logic becomes independently unit-testable and reusable in cron jobs, workers, etc.

### Error flow:
```
Route Handler (throws ApiError)
       ↓
asyncHandler (catches, calls next(err))
       ↓
errorHandler middleware (normalizes + responds)
```

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Configure environment
```bash
# Copy the template
cp .env.example .env

# Edit .env and set your actual MONGO_URI
```

### 3. Start development server
```bash
npm run dev        # Uses nodemon — auto-restarts on file changes
# or
npm start          # Plain node — for production
```

### 4. Verify it's running
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server running successfully",
  "environment": "development",
  "timestamp": "2024-...",
  "uptime": "5s",
  "database": {
    "status": "connected",
    "name": "restaurant_reservations"
  }
}
```

---

## 🔌 API Endpoints

| Method | Endpoint     | Description              | Auth Required |
|--------|-------------|--------------------------|---------------|
| GET    | /api/health | Server health check      | No            |

*More endpoints will be added with each feature module.*

---

## 🛡️ Security Features

| Feature | Package | Purpose |
|---------|---------|---------|
| HTTP Headers | `helmet` | XSS, clickjacking, CSP protection |
| Rate Limiting | `express-rate-limit` | Prevents brute-force & DDoS |
| CORS | `cors` | Restricts cross-origin requests |
| Payload limit | built-in | 10kb cap prevents payload bombs |

---

## 🔧 Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_ENV` | Yes | `development` / `production` / `test` |
| `PORT` | No | HTTP port (default: 5000) |
| `MONGO_URI` | Yes | Full MongoDB connection string |
| `JWT_SECRET` | Yes | Secret key for signing JWT tokens |
| `JWT_EXPIRE` | No | Token expiry (default: `30d`) |
| `CLIENT_URL` | No | Allowed CORS origin (default: `http://localhost:3000`) |
| `RATE_LIMIT_WINDOW_MS` | No | Rate limit window in ms (default: 900000 = 15min) |
| `RATE_LIMIT_MAX` | No | Max requests per window per IP (default: 100) |

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js 4.x |
| Database | MongoDB via Mongoose 8.x |
| Auth | JWT (jsonwebtoken) |
| Env config | dotenv |
| Security | helmet, cors, express-rate-limit |
| Logging | morgan (HTTP), custom logger |
| Compression | compression (gzip) |
| Dev tooling | nodemon |
