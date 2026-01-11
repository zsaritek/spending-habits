# Spending Habits

A small, local-first expense tracker. It’s meant to be quick to use, not a full accounting system.

Your data is stored in **localStorage** (in your browser). No accounts. No backend.

## Features

- Add an expense: amount, category, date, note (optional)
- List expenses (most recent first) + delete
- Summary totals: today, this month, all-time
- Filter the list by category and date range

## Tech stack

- Vue 3 (Composition API)
- Vite
- Tailwind CSS

## Run it

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Future ideas (maybe)

- Edit an expense
- Choose currency + number formatting
- Export/import (CSV or JSON)
