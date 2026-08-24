# FranchiseGuard AI — Multimodal Franchise Compliance Intelligence Platform

> **Problem Statement #18:** Franchise Standards Auditor  
> **Tagline:** AI-powered continuous compliance intelligence for every franchise location.  
> **Core AI Engine:** Powered natively by **RocketRide** declarative `.pipe` pipelines.

---

## 🚀 Overview

**FranchiseGuard AI** is an enterprise AI-native compliance intelligence SaaS platform designed for franchise operations managers, regional directors, and compliance officers overseeing hundreds of independently operated locations.

Instead of relying solely on periodic physical inspections, FranchiseGuard AI continuously audits locations using location-submitted photos, videos, inspection reports, customer review feeds, and operational signals. It automatically detects compliance violations, calculates multi-factor location risk, detects recurring issues, recommends corrective action plans, and routes formal enforcement decisions (cure notices, formal defaults) to human managers.

---

## 🎯 Key Product Principle: ZERO FALSE ACCUSATION GUARANTEE

> **NO EVIDENCE = NO VIOLATION CLAIM.**

Every detected violation includes:
- Source visual or document evidence
- AI confidence score ($\ge 90\%$)
- Mapped Brand Standard code & severity rating
- Recurrence history count
- Human review approval for formal default packages & cure notices

---

## 🏗️ RocketRide Multimodal AI Architecture

```
                    ┌─────────────────────────┐
                    │       WEB DASHBOARD      │
                    │ Next.js 14 / Tailwind UI │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │       API SERVER         │
                    │ Auth / Locations / Data  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     ROCKETRIDE ENGINE    │
                    │  AI ORCHESTRATOR (.pipe) │
                    └────────────┬────────────┘
                                 │
   ┌─────────────────────────────┼────────────────────────────┐
   │                             │                            │
   ▼                             ▼                            ▼
IMAGE AGENT                  VIDEO AGENT                  TEXT AGENT
   │                             │                            │
   └─────────────────────────────┼────────────────────────────┘
                                 ▼
                          STANDARDS AGENT
                                 │
                                 ▼
                          VIOLATION ANALYST
                                 │
                                 ▼
                         RISK SCORING AGENT
                                 │
                                 ▼
                     RECURRENCE DETECTION AGENT
                                 │
                                 ▼
                          ACTION RECOMMENDER
                                 │
                                 ▼
                             VALIDATOR
                                 │
                   ┌─────────────┴─────────────┐
                   ▼                           ▼
               LOW RISK                    HIGH RISK
                   │                           │
                   ▼                           ▼
              AUTO ACTION                 HUMAN REVIEW
                                               │
                                               ▼
                                     APPROVE / EDIT / REJECT
                                               │
                                               ▼
                                      FORMAL CURE NOTICE
                                               │
                                               ▼
                                     FINAL COMPLIANCE REPORT
```

### RocketRide `.pipe` Pipelines (`/rocketride`)

| Pipeline File | Description |
| :--- | :--- |
| [`full_audit_pipeline.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/full_audit_pipeline.pipe) | Master end-to-end audit orchestration pipeline. |
| [`media_ingestion.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/media_ingestion.pipe) | Photo validation, video frame sampling, and inspection OCR parser. |
| [`inspection_pipeline.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/inspection_pipeline.pipe) | Scheduled audit scheduling and customer complaint feed analyzer. |
| [`violation_detection.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/violation_detection.pipe) | Multimodal visual/text violation detector matched against brand standards. |
| [`risk_scoring.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/risk_scoring.pipe) | Multi-factor risk calculator (0-100) with transparent driver attribution. |
| [`recurrence_analysis.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/recurrence_analysis.pipe) | Cross-inspection recurrence detector flagging repeated failures. |
| [`human_review.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/human_review.pipe) | Human approval gate for high-risk cure notices and formal warnings. |
| [`reinspection.pipe`](file:///c:/Users/tripa/OneDrive/Desktop/my%20projects/hwup26/rocketride/reinspection.pipe) | Before-and-after evidence verification pipeline. |

---

## 📦 Quick Start & Execution

### 1. Sync Database Schema
```bash
npx prisma db push
```

### 2. Seed Demo Dataset (50 Locations, 200+ Assets, 100+ Reviews)
```bash
npm run seed
```

### 3. Run Test Suite
```bash
npm test
```

### 4. Build Next.js Production App
```bash
npm run build
```

### 5. Start Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) and click **"Load Franchise Demo Dataset"** or **"Instant Demo Login"** to audit Location #042 (4-time recurring violation, Risk 82/100)!

---

## 🌐 GitHub Repository & Deployment
- **GitHub Repo:** [https://github.com/Er-Sampoorn/hwup26.git](https://github.com/Er-Sampoorn/hwup26.git)
- **Deployment Platform:** Vercel (Next.js 14)
