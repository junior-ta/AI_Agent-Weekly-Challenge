import { streamText, stepCountIs } from "ai";
import { ollama } from "@ai-sdk/ollama";
import { countLettersTool } from "@/app/tools/countLetters";

export async function POST(req: Request) {
  const { messages } = await req.json();

  return streamText({
    model: ollama("llama3.1"), // must match what you pulled in Ollama
    messages,
    tools: {
      countLetters: countLettersTool,
    },
    system: `
You are a helpful conversational chatbot.

If the user asks something requiring deterministic precision
(counting letters, counting words, numeric checks, exact matching),
use the appropriate tool instead of guessing.
    `,
    // Safety guard against infinite tool loops
    stopWhen: stepCountIs(4),
  }).toResponse();
}
