# Shifty

Shifty is a year-at-a-glance shift rotation planner. Define a repeating shift pattern, pick a start date, and Shifty lays out the whole year so you can see which days you're on and off at a glance.

## Features

- **Year calendar view** — every month rendered together, with each day colored by shift status.
- **Custom shift patterns** — configure a repeating on/off (or multi-shift) rotation from a chosen start date.
- **Day status popup** — click a day to inspect or override its status.
- **Date picker controls** for adjusting the rotation start and navigating the calendar.
- **Guided tutorial** (via `driver.js`) that walks new users through setting up their first pattern.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) with React 19 and TypeScript
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Drizzle ORM](https://orm.drizzle.team) with PostgreSQL for persistence
- [Zod](https://zod.dev) for validation
- [date-fns](https://date-fns.org) for date math
- [driver.js](https://driverjs.com) for the onboarding tour

## Getting Started

### Prerequisites

- Node.js and a package manager (pnpm is used for the lockfile in this repo)
- A running PostgreSQL instance

### Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment example and fill in your database connection:

   ```bash
   cp .env.example .env
   ```

   ```
   DATABASE_URL="postgres://postgres:postgres@localhost:5432/shifty_db"
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

3. Push the database schema (or run migrations):

   ```bash
   pnpm db:push
   # or, using the generated migrations in ./drizzle
   pnpm db:migrate
   ```

4. Start the development server:

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
  app/
    (dashboard)/     # main calendar dashboard route
    api/rotations/   # rotation API route
  components/
    features/        # year calendar, month card, shift controls/stats
    ui/               # shared UI primitives
  db/
    schema/           # Drizzle schema definitions
  server/actions/     # server actions
  lib/                # shared utilities
drizzle/              # generated SQL migrations
```

## Available Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run the production build |
| `pnpm lint` | Lint the codebase |
| `pnpm format` | Format with Prettier |
| `pnpm db:generate` | Generate Drizzle migrations from schema changes |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:push` | Push the schema directly to the database |
| `pnpm db:studio` | Open Drizzle Studio |
