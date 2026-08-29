# FreshPick 🥬

**Stop food waste before it happens.** Log what's in your fridge, let AI prioritize what's about to expire, and get 3 recipes built around exactly what you already have.

![Status](https://img.shields.io/badge/status-active%20development-yellow)
![Backend](https://img.shields.io/badge/backend-Node%20%2B%20Express%20%2B%20TypeScript-339933)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20Vite-61DAFB)
![Database](https://img.shields.io/badge/database-PostgreSQL-336791)

## The problem

You get home with no idea what to cook, end up ordering delivery, and the food already in your fridge quietly goes bad. FreshPick closes that gap: it turns your actual inventory into a decision in seconds.

## How it works

1. **Log your ingredients** — name, quantity, and expiration date.
2. **The app tracks freshness** — each item is color-coded by urgency (fresh → expiring soon → urgent → expired).
3. **Generate recipes** — an LLM reads your current inventory and returns exactly 3 recipes, prioritizing ingredients closest to expiring.
4. **Shopping list** — add what you need to buy; duplicate entries are automatically blocked.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL (via Docker) |
| Frontend | React, Vite, TypeScript |
| AI | Hugging Face Inference Providers (Qwen2.5-72B-Instruct) |
| Styling | Custom CSS design system (no framework) |

## Project structure
