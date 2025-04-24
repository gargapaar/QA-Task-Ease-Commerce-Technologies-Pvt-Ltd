# QA Automation Tasks: EaseCommerce

This repository contains two automated test files:

1. `api.test.ts`: API-based test cases.

api.test.ts

This project contains Playwright API tests for:

1. Login API (Token extraction)
2. Warehouse API (With token)
3. Negative Tests (Invalid token, missing params, no warehouse data)

---
## Prerequisites

- Node.js installed – [https://nodejs.org]
(https://nodejs.org)

---
## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/gargapaar/QA-Task-Ease-Commerce-Technologies-Pvt-Ltd
cd easecommerce-api-tests

# 2. Install dependencies
npm install

# 3. Install Playwright (optional)
npx playwright install

```
Running Statement:
```
npx playwright test api.test.ts
```

2. `UI.test.js`: End-to-end UI workflow for task creation using TestCafe.

## Prerequisites
```
npm install testcafe --save-dev
```
Running Statement:
```
npx testcafe chrome UI.test.js
```

