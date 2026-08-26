# RocketRide Staging Process Integration Guide

> **Official Hackathon Staging Integration Guide for FranchiseGuard AI**

---

## 🎯 Staging Integration Overview

FranchiseGuard AI is fully integrated into the **RocketRide Staging Process** (`staging.rocketride.ai`). All 15+ declarative `.pipe` pipelines are synchronized, validated, and deployable to RocketRide Cloud Staging.

---

## 🔑 Staging Credentials & Configuration

- **Staging Endpoint:** `https://staging.rocketride.ai`
- **API URI:** `https://staging.rocketride.ai/v1`
- **Hackathon Promo Code:** `INDIAHACK`
- **Toolchain:** `pnpm` or `npm` (run commands with `npx tsx`)

---

## 🚀 How to Deploy & Verify on Staging

### 1. Command Line Deployment (CLI)

Run the automated RocketRide Staging deployment script:

```bash
npm run deploy:staging
# OR
pnpm run deploy:staging
```

This CLI tool:
- Scans and validates all `.pipe` pipeline files in `/rocketride`.
- Verifies connection to `https://staging.rocketride.ai`.
- Redeems/applies hackathon promo code `INDIAHACK`.
- Registers and activates all 15 declarative pipelines on RocketRide Cloud Staging.

---

### 2. Web Dashboard 1-Click Deployment

1. Start the web application:
   ```bash
   npm run dev
   ```
2. Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard).
3. Observe the **RocketRide Staging Process Integrated** status banner.
4. Click **"Deploy to RocketRide Staging"** or **"Sync .pipe Package"**.
5. Inspect live deployment logs and confirmation of active pipelines.

---

### 3. REST API Staging Endpoints

- **`GET /api/rocketride/staging`**: Checks health, connection status, promo code redemption, and pipeline counts.
- **`POST /api/rocketride/staging`**: Triggers real-time pipeline packaging and deployment to `staging.rocketride.ai`.

---

## 🧪 Automated Staging Verification Suite

Run the full automated test suite including RocketRide Staging integration tests:

```bash
npm test
```

Expected Output:
```text
Test 4: Testing RocketRide Staging Process Integration & Deployment...
  ✓ RocketRide Staging Integration passed: Target 'https://staging.rocketride.ai', Promo Code 'INDIAHACK', Deployed 15 .pipe files successfully.

==========================================
Test Results: 11 Passed, 0 Failed
==========================================
```
