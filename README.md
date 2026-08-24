# BidForge AI — Production-Ready AI RFP & Tender Automation Platform

> **Tagline:** Evidence-backed RFP automation for high-volume proposal teams.  
> **Core AI Orchestration Engine:** Powered natively by **RocketRide** declarative `.pipe` pipelines.

---

## 🚀 Overview

**BidForge AI** is an enterprise proposal automation SaaS platform built for presales, bid, and procurement teams responding to large volumes of RFPs, RFQs, tenders, and security questionnaires.

BidForge AI ingests multi-format RFP documents, extracts structured requirements, retrieves relevant company evidence from an indexed knowledge base, delegates tasks across **8 specialist AI agents**, deterministically scores confidence, routes uncertain or high-risk items to human reviewers, and generates submission-ready proposal packages (**DOCX**, **PDF**, **Excel Compliance Matrix**, **JSON**).

---

## 🎯 Key Product Principle: ZERO HALLUCINATION

> **AI MUST NOT CONFIDENTLY INVENT INFORMATION.**

If the system cannot find sufficient evidence in the company knowledge base, it explicitly outputs:
```
"Insufficient evidence — human review required."
```
- **Confidence Score:** Assigned $\le 50\%$
- **Status:** `unsupported` / `needs_review`
- **Risk:** `high` / `medium`
- **Routing:** Automatically sent to the **Human Review Inbox**.

---

## 🏗️ Architecture & RocketRide Role

```
                     ┌───────────────────────┐
                     │       WEB APP         │
                     │ Next.js 14 / Tailwind │
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │      API SERVER       │
                     │ Next.js API / Node.js │
                     │ Auth, Projects, RFPs  │
                     │ Reviews, Exports      │
                     └───────────┬───────────┘
                                 │
                                 ▼
                     ┌───────────────────────┐
                     │   ROCKETRIDE ENGINE   │
                     │  Orchestrator (.pipe) │
                     │ Ingestion, Extraction │
                     │ Routing, Validation   │
                     └───────────┬───────────┘
                                 │
          ┌──────────────────────┼───────────────────────┐
          ▼                      ▼                       ▼
   Requirement Agent       Evidence Agent          Compliance Agent
          │                      │                       │
          └──────────────────────┼───────────────────────┘
                                 ▼
                          Drafting Agent
                                 │
                                 ▼
                          Validation Agent
                                 │
                       ┌─────────┴─────────┐
                       ▼                   ▼
                 High Confidence      Low Confidence
                       │                   │
                       ▼                   ▼
                   Auto Pass          HUMAN REVIEW
                                           │
                                           ▼
                                   Approved Response
                                           │
                                           ▼
                                Final Proposal Package
```

### RocketRide `.pipe` Pipelines Directory (`/rocketride`)

| Pipeline File | Description |
| :--- | :--- |
| [`full_rfp_pipeline.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/full_rfp_pipeline.pipe) | Master end-to-end orchestration pipeline. |
| [`ingestion.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/ingestion.pipe) | Multi-format document parser, text extraction, and semantic chunker. |
| [`requirements.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/requirements.pipe) | Requirement extraction, classification, and mandatory detection. |
| [`evidence.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/evidence.pipe) | Hybrid vector/keyword knowledge base search and chunk ranking. |
| [`agents.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/agents.pipe) | Specialist agent router (Technical, Commercial, Compliance, Writer). |
| [`validation.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/validation.pipe) | Factuality check, deterministic confidence scoring (0-100), risk assignment. |
| [`finalization.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/finalization.pipe) | Aggregation into compliance matrix and export package synthesis. |

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
- **Backend:** Node.js, Next.js API Routes, TypeScript.
- **Database & ORM:** SQLite via Prisma ORM (Zero-dependency local setup, PostgreSQL compatible).
- **Document Parsers:** `pdf-parse`, `mammoth` (DOCX), `xlsx` (Excel & CSV).
- **Exporters:** `docx` (Word), `jspdf` (PDF), `xlsx` (Excel Compliance Matrix), JSON.
- **AI Engine:** RocketRide `.pipe` Orchestrator with fallback execution runner and Cloud API hooks.

---

## 📦 Quick Start & Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Push Database Schema
```bash
npx prisma db push
```

### 3. Seed Demo Dataset (100+ Requirements, 20+ Evidence Docs)
```bash
npm run seed
```

### 4. Run Automated Test Suite
```bash
npm test
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Demo Workflow & Instant Verification

1. Click **"Load Demo Dataset"** in the top navigation bar or click **"Instant Demo Login"** on `/login`.
2. Open the **"Acme Telecom Enterprise RFP 2026"** workspace.
3. Click **"Analyze RFP with RocketRide"** to view real-time pipeline visualizer, node status, token counts, and cost estimation.
4. Explore the **Requirements Matrix** with multi-filters (`Category`, `Status`, `Risk`, `Mandatory`, `Search`).
5. Open **REQ-001** (Security) or **REQ-042** (Missing Evidence) to inspect evidence snippets, page/section references, and agent trace logs.
6. Approve, edit, or reject responses in the **Review Inbox**.
7. Export submission-ready packages in **DOCX**, **PDF**, **Excel**, or **JSON**.

---

## 🐳 Docker Deployment

```bash
docker-compose up --build -d
```

---

## 📄 License
Enterprise Commercial License — BidForge AI.
