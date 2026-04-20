-- HNSW indexes for pgvector-based similarity search.
-- Apply after the first `prisma migrate dev` run. See migrations/README.md.

CREATE INDEX IF NOT EXISTS "CandidateProfile_embedding_hnsw"
  ON "CandidateProfile" USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS "JobPosting_embedding_hnsw"
  ON "JobPosting" USING hnsw (embedding vector_cosine_ops);
