# Migrations

Run `npm run prisma:migrate -- --name init` once `DATABASE_URL` is set (Neon with
the `pgvector` extension enabled).

After the initial migration, create a second migration for the pgvector indexes:

```bash
npx prisma migrate dev --create-only --name add_vector_indexes
```

Then paste `vector_indexes.sql` (sibling of this file) into the generated
`migration.sql` and apply with `npx prisma migrate dev`.

The indexes use the HNSW algorithm on cosine distance, which is the best fit
for similarity search on 1536-dim OpenAI embeddings.
