This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 🧠 Churn Prediction System

The Moviment Academy platform includes an AI-powered churn prediction module to identify students at risk of leaving the gym.

### 🛠 Technology Stack
- **Backend:** FastAPI (Python)
- **Machine Learning:** Scikit-learn (Random Forest)
- **Data Engineering:** Pandas
- **Frontend:** Next.js + Tailwind CSS + Lucide Icons
- **Testing:** Pytest (API/Data), Playwright (UI)

### 🚀 How to Run

#### 1. Prepare the Data & Model
The model depends on three source files in `backend/data/`: `recebimentos.csv`, `devedores.csv`, and `frequencia_treino.csv`.

```bash
# Ingest data and perform feature engineering
python backend/data/ingest_churn.py

# Train the Random Forest model
python backend/train_churn_model.py
```

#### 2. Start the API
```bash
# From the root directory
uvicorn backend.main:app --reload
```

#### 3. Run the Frontend
```bash
npm run dev
```

### 🧪 Automated Tests
The project includes a comprehensive suite of tests:

```bash
# Run API and Data Ingestion tests
pytest tests/api tests/data

# Run UI End-to-End tests (Playwright)
npm run test:ui
```

### 📊 API Endpoints
- `POST /predict/churn`: Predicts churn risk for a student based on monthly frequency, delay days, monthly value, and inadimplência status.
- `GET /health`: Health check for the API.

