# ROTEIRO DE EXTENSÃO – BIG DATA

**Instituição:** Faculdade Estácio – Campus Castanhal

**Curso:** Análise e Desenvolvimento de Sistemas

---

## 1. DIAGNÓSTICO E TEORIZAÇÃO

### 1.1 Identificação das partes interessadas e parceiros

- **Academia Moviment** – Parceira operacional que fornece os dados de controle de acesso (catraca), pagamentos e frequência dos alunos via sistema SCA.
- **Gestão da Academia** – Responsáveis por tomar decisões estratégicas com base nos insights gerados.
- **Alunos da Academia** – Beneficiados com estratégias de fidelização e melhoria da experiência.
- **Equipe de Extensão (Estácio – Castanhal)** – Responsável pela concepção, desenvolvimento e entrega da solução.

### 1.2 Problemática ou problemas identificados

A Academia Moviment possui um sistema de gestão eficiente (SCA) que captura ricos dados operacionais, porém esses dados ainda são utilizados apenas de forma descritiva. Não há exploração preditiva capaz de antecipar churn, identificar padrões de engajamento ou gerar políticas de incentivo baseadas em comportamento.

### 1.3 Justificativa

- Transformar dados operacionais em **informação estratégica**.
- Reduzir a evasão de alunos (churn) mediante intervenções proativas.
- Fortalecer o vínculo cliente‑empresa por meio de benefícios data‑driven.

### 1.4 Objetivos / Resultados / Efeitos

**Objetivo Geral:**
Desenvolver uma solução preditiva em Python que forneça insights estratégicos à Academia Moviment e, simultaneamente, sirva como caso de estudo para a disciplina de Big Data.

**Objetivos Específicos:**
- Coletar e tratar os relatórios CSV (recebimentos, devedores, frequência de treino).
- Analisar padrões de frequência e pagamento.
- Treinar modelo de classificação de risco de evasão (Random Forest).
- Construir dashboard interativo (Next.js + Tailwind).
- Propor programa de fidelização baseado em métricas de engajamento.

**Resultados Esperados:**
- Aumento da taxa de retenção em >10%.
- Redução da taxa de churn em >15%.
- Melhoria na tomada de decisão da gestão (KPIs claros).

### 1.5 Referencial Teórico

- **Análise Preditiva** – Uso de algoritmos de Machine Learning para prever comportamentos futuros a partir de dados históricos.
- **Bibliotecas Python** – Pandas, Matplotlib/Seaborn, Scikit‑learn.
- **Dashboard** – Next.js (React) e Tailwind CSS para visualização de resultados.
- **API** – FastAPI para servir os scores do modelo.

---

## 2. PLANEJAMENTO E DESENVOLVIMENTO DO PROJETO

### 2.1 Plano de trabalho (ferramenta acordada com o docente)

| Semana | Atividade |
|--------|-----------|
| **1** | Reunião de alinhamento com a gestão; levantamento de requisitos; exportação dos relatórios base (recebimentos.csv, devedores.csv, frequencia_treino.csv). |
| **2** | Ingestão e tratamento dos dados; construção do pipeline de Big Data com Pandas. |
| **3** | Desenvolvimento e treinamento do modelo de Machine Learning (Random Forest – Scikit‑learn). |
| **4** | Implementação do dashboard (Next.js + Tailwind) e integração com API FastAPI. |
| **5** | Testes automatizados, validação de dados e implantação (Vercel – Frontend, Render – Backend, Supabase – Banco). |
| **6** | Apresentação final para a Academia Moviment e entrega dos relatórios de extensão. |

### 2.2 Envolvimento do público participante

O envolvimento dos gestores da Academia Moviment ocorreu de forma direta e colaborativa. O aluno Smayk Dornelles estabeleceu o contato inicial com a gestão para propor a parceria. Posteriormente, os alunos Smayk Dornelles e Antonio Ryquelme realizaram uma visita técnica presencial à academia para o primeiro contato físico com o espaço e os gestores. Durante esta visita, foi realizado o levantamento de informações sobre o sistema atual utilizado pela academia, visando viabilizar a exportação dos relatórios necessários. Além disso, a reunião foi fundamental para entender as necessidades reais do negócio e como o trabalho proposto poderá contribuir para melhorar a fidelização dos alunos através da inteligência de dados.

### 2.3 Grupo de trabalho

- **Smayk Dornelles Ucha Cavalcante** – **Front‑end & Back‑end Lead**. Responsável por todo o contato com a gestão, ingestão e tratamento dos dados, desenvolvimento do modelo preditivo e da aplicação completa (FastAPI, Next.js, Supabase).
- **Antonio Ryquelme** – **Responsável pelo Relatório de Roteiro**. Responsável por compor a documentação, estruturação do roteiro e revisão final do conteúdo.

### 2.4 Metas, critérios ou indicadores de avaliação

- **Acurácia do Modelo** ≥ 80% na classificação de risco de churn.
- **Tempo de Processamento** ≤ 5 segundos para ingestão de todos os relatórios CSV.
- **Satisfação do Gestor** ≥ 4/5 em avaliação de usabilidade do dashboard.

### 2.5 Recursos previstos

- **Materiais** – Computador pessoal, conexão à internet.
- **Tecnológicos** – Python, Pandas, Scikit‑learn, FastAPI, Next.js, Tailwind CSS, Vercel, Render, Supabase (planos gratuitos).
- **Institucionais** – Dados CSV anonimizados fornecidos pela Academia Moviment.
- **Humanos** – 1 estudante desenvolvedor (Smayk) + apoio da gestão da academia.

### 2.6 Detalhamento técnico do projeto

1. **Coleta & Limpeza** – Scripts `ingest_churn.py` consolida arquivos CSV e aplica tratamento de valores ausentes.
2. **Feature Engineering** – Criação de variáveis: frequência mensal, dias de atraso, status de adimplência.
3. **Modelagem** – Treinamento de Random Forest; avaliação via cross‑validation e curva ROC.
4. **API** – FastAPI expõe endpoint `/predict` retornando risco de churn e explicações SHAP.
5. **Frontend** – Dashboard em Next.js mostra KPI’s (taxa de churn, distribuição de frequência) e lista de alunos em risco com badges.

---

## 3. ENCERRAMENTO DO PROJETO

### 3.1 Relatório Coletivo

- Documentação completa entregue à Academia Moviment (relatório técnico, código fonte e instruções de implantação).
- Apresentação presencial com demonstração ao vivo da plataforma.

### 3.2 Avaliação de reação da parte interessada

- Gestores relataram ** entusiasmo** ao visualizar predições de churn e insights de comportamento.
- Feedback positivo sobre a possibilidade de automatizar intervenções (ex.: mensagens via WhatsApp).

### 3.3 Relato de Experiência Individual – Smayk Dornelles

#### Contextualização

Desenvolvi a solução integrando ciência de dados e desenvolvimento web, enfrentando desafios de limpeza de dados heterogêneos e criação de UI responsiva.

#### Metodologia

Segui o fluxo de coleta → tratamento → modelagem → API → frontend, utilizando boas práticas de versionamento (Git) e CI/CD (GitHub Actions → Vercel/Render).

#### Resultados e Discussão

A solução entregou **acurácia >82%**, reduziu o tempo de ingestão de dados para **3 s** e gerou dashboards interativos que foram bem recebidos.

#### Reflexão aprofundada

A experiência mostrou que a qualidade da engenharia de features impacta mais o desempenho que a complexidade algorítmica.

#### Considerações finais

Futuros aprimoramentos incluem: integração de notificações automáticas (WhatsApp), teste de modelos leves (logística) e exploração de ferramentas no‑code (PowerBI) para ampliar a democratização do acesso aos insights.
