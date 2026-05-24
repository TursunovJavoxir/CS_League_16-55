# 🎮 CS League Platform — Competitive CS Tournament System

![React](https://img.shields.io/badge/Frontend-React%2019-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel)
![Render](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge&logo=render)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

Современная fullstack платформа для проведения CS-турниров с системой ELO-рейтинга, placement-калибровкой, live veto системой, турнирными сетками, Hall of Fame и полноценной backend-архитектурой.

---

# 🌐 Live Demo

## Frontend

https://cs-league-16-55.vercel.app/

## Backend API

https://cs-league-16-55.onrender.com/

## Swagger Documentation

https://cs-league-16-55.onrender.com/docs

## GitHub Repository

https://github.com/TursunovJavoxir/CS_League_16-55

---

# 🚀 Основные Возможности

## 🔐 Authentication & Security

- JWT Authentication
- Регистрация и авторизация игроков
- Admin Role System
- Protected Routes
- Password Hashing (bcrypt)
- Token-based authorization
- Защита admin endpoints
- CORS protection

---

## 🏆 Competitive System

### ELO Ranking System

- Динамический ELO
- Rank progression
- Winrate tracking
- Peak ELO
- MVP statistics
- Match history
- Seasonal rankings

### Placement Calibration

- Placement matchmaking
- Calibration system
- Automatic placement completion
- Placement protection
- Placement-only state

---

## 🎮 Tournament Engine

### Поддерживаемые размеры турниров

| Players | Status |
|---|---|
| 5 | ✅ |
| 6 | ✅ |
| 7 | ✅ |
| 8 | ✅ |
| 9–15 | ✅ |
| 16 | ✅ |

### Tournament Features

- Automatic bracket generation
- Qualification rounds
- Quarterfinals
- Semifinals
- Grand Final
- Round of 16
- Automatic BYE logic
- Automatic winner advancement
- Tournament completion system
- Champion rewards

---

# 🗺️ Live Match Veto System

Реализована полноценная live veto система:

- Поочерёдный бан карт
- Автоматическое переключение хода
- Auto-refresh без F5
- Автоматический выбор финальной карты
- Veto validation
- Pending match synchronization

---

# 🏅 Seasons & Hall of Fame

- Seasonal leaderboard
- Seasonal champions
- Hall of Fame
- Historical snapshots
- Achievement rewards
- Season rewards
- Champion preservation system

---

# 🧱 Архитектура Проекта

```text
Frontend (React + Vite)
        ↓
REST API
        ↓
Backend (FastAPI)
        ↓
SQLAlchemy ORM
        ↓
PostgreSQL (Neon)
```

---

# 🛠️ Tech Stack

## Frontend

- React 19
- Vite
- TailwindCSS
- React Router DOM

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- JWT
- Uvicorn

## Database

- PostgreSQL (Neon)

## Deploy Infrastructure

- Vercel (Frontend)
- Render (Backend)
- Neon PostgreSQL

---

# 📂 Структура Проекта

```text
CS_League_16-55/
│
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   ├── utils/
│   │   ├── auth.py
│   │   ├── database.py
│   │   └── main.py
│   │
│   ├── alembic/
│   ├── requirements.txt
│   └── runtime.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   └── utils/
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Установка Локально

## Clone Repository

```bash
git clone https://github.com/TursunovJavoxir/CS_League_16-55.git
cd CS_League_16-55
```

---

# 🔧 Backend Setup

```bash
cd backend
```

## Создание venv

```bash
python -m venv .venv
```

## Активация

### Windows

```bash
.venv\Scripts\activate
```

### Linux/macOS

```bash
source .venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Backend Environment Variables

Создать `.env`

```env
DATABASE_URL=your_postgresql_url

JWT_SECRET_KEY=your_secret_key

JWT_ALGORITHM=HS256

FRONTEND_URL=http://localhost:5173
```

---

## Run Backend

```bash
uvicorn app.main:app --reload
```

---

# 🎨 Frontend Setup

```bash
cd frontend
```

## Install Dependencies

```bash
npm install
```

---

## Frontend Environment Variables

Создать `.env`

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## Run Frontend

```bash
npm run dev
```

---

# 🔐 Security Features

- JWT authorization
- Password hashing
- Admin protection
- Duplicate prevention
- Match validation
- Placement spam protection
- Tournament validation
- Environment variable isolation

---

# 📘 API Overview

## Auth

```text
POST /auth/register
POST /auth/login
```

---

## Players

```text
GET    /players
GET    /players/{id}
GET    /players/{id}/matches

POST   /players
POST   /players/bulk
POST   /players/reset-stats
```

---

## Matches

```text
POST /matches
POST /matches/{id}/finish
POST /matches/{id}/ban-map
```

---

## Tournaments

```text
POST /tournaments
POST /tournaments/{id}/generate-bracket
POST /tournaments/{id}/matches/{id}/finish
```

---

# 🔥 Реализованные Системы

| System | Status |
|---|---|
| JWT Auth | ✅ |
| Admin Panel | ✅ |
| ELO System | ✅ |
| Placement Matches | ✅ |
| Tournament Engine | ✅ |
| Live Veto | ✅ |
| Hall of Fame | ✅ |
| Seasonal Rewards | ✅ |
| Achievements | ✅ |
| Match History | ✅ |
| Swagger API | ✅ |
| Production Deploy | ✅ |

---

# 📈 Roadmap

## Planned Features

- WebSocket realtime system
- Team system
- Match analytics
- Spectator mode
- Public API
- Match demo uploads
- Advanced admin dashboard
- CI/CD improvements
- Docker support
- Tournament statistics

---

# 👨‍💻 Автор

## Javoxir Tursunov

GitHub:

https://github.com/TursunovJavoxir

---

# 📄 License

MIT License

