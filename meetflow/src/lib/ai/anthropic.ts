import Anthropic from "@anthropic-ai/sdk";

// Default model is claude-sonnet-4-6 per product spec §2. Override via env so we
// can switch to claude-opus-4-7 for specific high-stakes evaluators later.
export const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6";

let _client: Anthropic | null = null;

export function anthropic(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local or your deployment environment."
    );
  }
  _client = new Anthropic({ apiKey });
  return _client;
}
