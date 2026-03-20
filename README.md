# HealthScore — Health Score & Recommendation System

A full-stack web application that processes wearable device health data, computes a 0–100 health score, and returns personalized recommendations.

---

## 🏗️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React ,Axios         |
| Backend   | Node.js, Express.js                 |
| Database  | MongoDB + Mongoose     |
<!-- ---| Validation| express-validator                   |-->

<!-- ---

## 📁 Project Structure

```
health-app/
├── package.json              ← root scripts (run both together)
│
├── backend/
│   ├── server.js             ← Express entry point
│   ├── .env.example          ← copy to .env and configure
│   ├── config/
│   │   └── db.js             ← MongoDB connection
│   ├── routes/
│   │   ├── healthRoutes.js   ← POST /api/health-score
│   │   └── recordRoutes.js   ← GET/DELETE /api/records
│   ├── controllers/
│   │   ├── healthController.js
│   │   └── recordController.js
│   ├── services/
│   │   └── healthService.js  ← scoring logic + recommendations
│   └── models/
│       └── HealthRecord.js   ← Mongoose schema
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx            ← root component + layout
        ├── App.css            ← all styles
        ├── index.js           ← React entry point
        ├── services/
        │   └── api.js         ← Axios calls
        └── components/
            ├── HealthForm.jsx  ← input form with validation
            ├── ScoreCard.jsx   ← results display + radar chart
            └── History.jsx     ← past records (requires MongoDB)
``` -->

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- npm v9+
- MongoDB (optional — the API works without it)

### 1. Clone & install

```bash
git clone <https://github.com/vamsi0163/Health-score-app>
cd health-app
npm run install:all
```



### 2. Run in development mode

From the project root:
```bash
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

Or run them separately:
```bash
npm run dev:backend    # terminal 1
npm run dev:frontend   # terminal 2
```

---

## 📡 API Reference

### `POST /api/health-score`

Calculates a health score from raw metrics.

**Request body:**
```json
{
  "steps": 6500,
  "sleep_hours": 5.5,
  "heart_rate": 85,
  "calories": 1800,
  "water_intake": 1.5
}
```

**Response:**
```json
{
  "health_score": 46,
  "category": "Poor",
  "recommendations": [
    "You're 3,500 steps from 10,000. A 30-minute walk gets you there.",
    "Aim for 7–8 hours of sleep. Try a consistent bedtime routine.",
    "Drink 1.0L more water today. Carry a reusable bottle."
  ],
  "breakdown": {
    "steps": 8,
    "sleep": 8,
    "heart_rate": 10,
    "calories": 20,
    "water": 10
  }
}
```

**Validation rules:**

| Field         | Type  | Range          |
|---------------|-------|----------------|
| steps         | int   | 0 – 100,000    |
| sleep_hours   | float | 0 – 24         |
| heart_rate    | int   | 20 – 250       |
| calories      | int   | 0 – 10,000     |
| water_intake  | float | 0 – 20 (litres)|

---

### `GET /api/records`

Returns the 20 most recent health records (requires MongoDB).

**Response:** Array of record objects with `input`, `result`, and `createdAt`.

---

### `DELETE /api/records/:id`

Deletes a record by its MongoDB `_id`.

---

## 🧮 Scoring Logic

Each of the 5 metrics contributes **0–20 points** (total: 0–100).

| Score | Category          |
|-------|-------------------|
| 85–100| Excellent         |
| 70–84 | Good              |
| 50–69 | Needs Improvement |
| 30–49 | Poor              |
| 0–29  | Critical          |

### Metric thresholds

**Steps**
| Steps        | Points |
|-------------|--------|
| ≥ 10,000     | 20     |
| 8,000–9,999  | 16     |
| 6,000–7,999  | 12     |
| 4,000–5,999  | 8      |
| 2,000–3,999  | 4      |
| < 2,000      | 0      |

**Sleep Hours**
| Hours   | Points |
|---------|--------|
| 7–9     | 20     |
| 6–7     | 14     |
| 9–10    | 14     |
| 5–6     | 8      |
| > 10    | 8      |
| < 5     | 2      |

**Resting Heart Rate (bpm)**
| BPM       | Points |
|-----------|--------|
| 50–70     | 20     |
| 71–80     | 15     |
| 81–90     | 10     |
| 91–100    | 6      |
| < 50      | 10     |
| > 100     | 2      |

**Calories (kcal)**
| Calories      | Points |
|---------------|--------|
| 1,800–2,500   | 20     |
| 1,500–1,799   | 14     |
| 2,501–3,000   | 14     |
| 1,200–1,499   | 8      |
| > 3,000       | 8      |
| < 1,200       | 2      |

**Water Intake (litres)**
| Litres   | Points |
|----------|--------|
| ≥ 2.5    | 20     |
| 2.0–2.49 | 15     |
| 1.5–1.99 | 10     |
| 1.0–1.49 | 5      |
| < 1.0    | 0      |

---

## 🎨 Frontend Features

- **Input form** — all 5 metrics with client-side validation
- **Demo data button** — one-click prefill for quick testing
- **Score hero** — large visual score ring with category badge
- **Breakdown bars** — per-metric progress bars
- **Radar chart** — visual overview of all 5 metrics
- **Recommendations** — personalised suggestions per failing metric
- **History panel** — past 20 records with delete (requires MongoDB)

---

## 🌐 Deployment

### Backend — Render

```bash
cd backend
# Set env vars in your platform dashboard:
# PORT, MONGO_URI, NODE_ENV=production
npm start
```

### Frontend — Vercel 

```bash
cd frontend
# Set REACT_APP_API_URL=https://your-backend-url.com/api
npm run build
# Deploy the /build folder
```


