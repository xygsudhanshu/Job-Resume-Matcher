# New React Frontend — Setup

Simple English steps:

## 1. Where to put this folder

Delete your old `frontend` folder (the plain HTML one), and put this `frontend-react` folder in its place, inside `Job-Resume-Matcher`. So it looks like:

```
Job-Resume-Matcher/
├── backend/
└── frontend-react/   <- this new folder
```

## 2. Install Node.js (if you don't have it)

Go to nodejs.org, download the LTS version, install it (Next-Next like other installs).

Check it worked — open terminal and type:
```
node -v
```
It should show a version number.

## 3. Install and run

Open terminal INSIDE `frontend-react` folder (`cd frontend-react`), then run:

```
npm install
```

Wait for it to finish (downloads all needed packages — takes a minute).

Then run:

```
npm run dev
```

It will show a link like `http://localhost:5173` — open that in your browser.

## 4. Keep backend running too

Your FastAPI backend must still be running in another terminal (`python -m uvicorn app.main:app --reload`) — the React frontend talks to it at `http://127.0.0.1:8000`, same as before. CORS is already set up in your `main.py`, so nothing to change there.

## What changed

- Same signup, login, jobs, apply features — nothing in your backend needs to change
- New: a proper navbar, tabs for login/signup, an "Apply" popup with your match score shown nicely, and a "Post a job" page for companies
- Everything is responsive — works on mobile too
