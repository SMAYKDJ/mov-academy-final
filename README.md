Este é um projeto [Next.js](https://nextjs.org) inicializado com [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Começando

Primeiro, execute o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

Você pode começar a editar a página modificando `app/page.tsx`. A página é atualizada automaticamente conforme você edita o arquivo.

Este projeto utiliza [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) para otimizar e carregar automaticamente a [Geist](https://vercel.com/font), uma nova família de fontes da Vercel.

## Saiba Mais

Para saber mais sobre o Next.js, consulte os seguintes recursos:

- [Documentação do Next.js](https://nextjs.org/docs) - aprenda sobre os recursos e API do Next.js.
- [Aprenda Next.js](https://nextjs.org/learn) - um tutorial interativo do Next.js.

Você pode conferir [o repositório do Next.js no GitHub](https://github.com/vercel/next.js) - seu feedback e contribuições são bem-vindos!

## Implantar na Vercel

A maneira mais fácil de implantar seu app Next.js é usar a [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) dos criadores do Next.js.

Confira nossa [documentação de implantação do Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para mais detalhes.

---

## 🧠 Sistema de Previsão de Churn

A plataforma Moviment Academy inclui um módulo de previsão de churn alimentado por IA para identificar alunos com risco de abandonar a academia.

### 🛠 Stack Tecnológica
- **Backend:** FastAPI (Python)
- **Machine Learning:** Scikit-learn (Random Forest)
- **Engenharia de Dados:** Pandas
- **Frontend:** Next.js + Tailwind CSS + Ícones Lucide
- **Testes:** Pytest (API/Dados), Playwright (UI)

### 🚀 Como Executar

#### 1. Preparar os Dados e o Modelo
O modelo depende de três arquivos de origem em `backend/data/`: `recebimentos.csv`, `devedores.csv` e `frequencia_treino.csv`.

```bash
# Ingerir dados e realizar engenharia de recursos
python backend/data/ingest_churn.py

# Treinar o modelo Random Forest
python backend/train_churn_model.py
```

#### 2. Iniciar a API
```bash
# A partir do diretório raiz
uvicorn backend.main:app --reload
```

#### 3. Executar o Frontend
```bash
npm run dev
```

### 🧪 Testes Automatizados
O projeto inclui uma suíte abrangente de testes:

```bash
# Executar testes de API e Ingestão de Dados
pytest tests/api tests/data

# Executar testes de UI End-to-End (Playwright)
npm run test:ui
```

### 📊 Endpoints da API
- `POST /predict/churn`: Prevê o risco de churn para um aluno com base na frequência mensal, dias de atraso, valor mensal e status de inadimplência.
- `GET /health`: Verificação de saúde da API.
