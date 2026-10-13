# 🏋️‍♂️ Douding Fitness (豆丁健身)

English | [简体中文](./README.zh-CN.md)

**Douding Fitness** is a modern, full-stack WeChat Mini Program designed for workout tracking, diet & macro logging, and AI-powered fitness coaching. Built with a type-safe architecture from frontend to backend, it helps users systematically record strength training sessions, monitor daily caloric deficits, and receive personalized guidance from an AI coach.

---

## ✨ Key Features

- 📅 **Workout Tracking**: Intuitive calendar view to log daily training sessions, target muscle groups, exercise sets, weights (kg), reps, and workout duration.
- 🥗 **Diet & Macro Logging**: Track daily meals (Breakfast, Lunch, Dinner, Snacks) with calorie estimation, macronutrient breakdown (Protein, Carbs, Fat), and meal photo check-ins.
- 🤖 **AI Fitness Coach**: Analyzes daily energy expenditure vs. caloric intake to calculate caloric deficits, offering tailored fat-loss advice and streaming Q&A for training plateaus.
- 📊 **Body Profile Management**: Record and track personal body metrics including height, current weight, and target weight goals.

---

## 🛠️ Tech Stack

### Client (Frontend)
- **Framework**: [uni-app](https://uniapp.dcloud.io/) + [Vue 3](https://vuejs.org/) (`<script setup>` Composition API)
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 5.x
- **State Management**: Pinia
- **UI Library**: Wot Design Uni

### Server (Backend)
- **Runtime & Framework**: Node.js + Express.js (TypeScript)
- **ORM & Database**: Prisma ORM + SQLite
- **Authentication**: Stateless JWT (JSON Web Token) + WeChat OAuth (`code2Session`)

---

## 📂 Project Structure

```text
douding-fitness/
├── client/          # Frontend Mini Program (uni-app + Vue 3 + TS + Vite + Pinia + Wot Design Uni)
├── server/          # Backend API Service (Node.js + Express + TS + Prisma + SQLite)
└── docs/            # Architecture, technical specifications & documentation
```

---

## 🚀 Getting Started

### 1. Frontend Mini Program (`client`)
```bash
cd client
pnpm install          # Install dependencies
pnpm dev:mp-weixin    # Start dev server with HMR (outputs to dist/dev/mp-weixin)
pnpm build:mp-weixin  # Build for production
```

### 2. Backend Service (`server`)
```bash
cd server
pnpm install          # Install dependencies
pnpm dev              # Start local dev server (http://localhost:3000)
pnpm prisma:studio    # Open Prisma Studio (visual database management UI)
pnpm build            # Compile TypeScript
pnpm start            # Run compiled production server
```

---

## 📱 WeChat DevTools Preview Guide

1. Open **WeChat DevTools (微信开发者工具)**.
2. Import the compiled project directory: `client/dist/dev/mp-weixin`.
3. The **AppID** will be automatically recognized as: `wx606fc804e012e441`.
4. Go to top-right **Details (详情)** -> **Local Settings (本地设置)**, and check **"Do not verify valid domain names, web-view (business domain names), TLS versions and HTTPS certificates" (不校验合法域名、web-view、TLS版本以及HTTPS证书)**.
