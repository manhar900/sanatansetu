# 🕉️ Sanatan Setu Library (`sanatansetulibrary.com`)

Full-stack rebuild of [sanatansetulibrary.com](https://sanatansetulibrary.com/) using **Django 5 + Django REST Framework** (`backend/`) and **Node.js + React 18 + Vite + Tailwind CSS** (`frontend/`), preserving all 12 Sacred Categories, all 23 Sacred Items, original SVG logo (`icon.svg`), and adding the **108-Bead Naam Jaap Counter**.

## Quick Start on macOS / Linux
### 1. Backend (Django REST API on `:8000`)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations library
python manage.py migrate
python manage.py seed_sanatansetu
python manage.py runserver 8000
```

### 2. Frontend (Node.js + React 18 + Vite on `:5173`)
```bash
cd frontend
npm install
npm run dev
```
