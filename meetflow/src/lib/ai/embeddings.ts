import OpenAI from "openai";

// We use OpenAI embeddings (text-embedding-3-small, 1536 dims) because Claude
// does not expose an embeddings API. The pgvector columns in schema.prisma are
// sized for this model; do not swap to 3-large without migrating the schema.
export const EMBEDDING_MODEL =
  process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";
export const EMBEDDING_DIMS = 1536;

let _client: OpenAI | null = null;

function openai(): OpenAI {
  if (_client) return _client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local or your deployment environment."
    );
  }
  _client = new OpenAI({ apiKey });
  return _client;
}

export async function embed(text: string): Promise<number[]> {
  // OpenAI rejects empty strings; short-circuit to a zero vector so the caller
  // can still update the row without a 400.
  const input = text.trim();
  if (input.length === 0) return new Array(EMBEDDING_DIMS).fill(0);

  const response = await openai().embeddings.create({
    model: EMBEDDING_MODEL,
    input,
  });
  const vector = response.data[0]?.embedding;
  if (!vector || vector.length !== EMBEDDING_DIMS) {
    throw new Error(`Embedding model returned unexpected shape (got ${vector?.length}).`);
  }
  return vector;
}

// Postgres array literal. pgvector accepts `'[0.1, 0.2, ...]'::vector` — the
// square brackets are required, parentheses return "malformed vector".
export function toVectorLiteral(vector: number[]): string {
  return `[${vector.join(",")}]`;
}
