# Deployment

## Local development

1. `cp .env.example .env.local` and fill in the Clerk + Neon values.
2. `npm install`
3. `npm run prisma:migrate -- --name init`
4. Apply vector indexes:
   `psql "$DATABASE_URL" -f prisma/vector_indexes.sql`
5. `npm run dev`

## Vercel

- Link the `meetflow/` directory as the project root.
- Set all env vars from `.env.example` in Vercel's dashboard.
- Enable Vercel Cron for Phase 3 batch jobs (`vercel.json` to be added).

## Neon

- Create a Postgres project and enable the `pgvector` extension:
  `CREATE EXTENSION IF NOT EXISTS vector;`
- Use a pooled connection URL for `DATABASE_URL` at runtime and the direct URL
  for migrations.
