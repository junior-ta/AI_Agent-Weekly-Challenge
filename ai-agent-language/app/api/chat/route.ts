import { streamText, stepCountIs } from "ai";
import { ollama } from 'ollama-ai-provider-v2';
import { countLettersTool } from "@/app/tools/countLetters";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: ollama("llama3.1"),
    messages,
    tools: {
      countLetters: countLettersTool,
    },
    system: `
You are a helpful assistant.

If a request requires exact counting or deterministic logic,
you MUST use the appropriate tool instead of guessing.
    `,
    stopWhen: stepCountIs(4),
  }).response; 

  // Get the last assistant message
  const lastMessage = result.messages[result.messages.length - 1];

  // Extract text safely
  let text = "";
  if (lastMessage?.role === "assistant") {
    if (typeof lastMessage.content === "string") {
      text = lastMessage.content;
    } else if (Array.isArray(lastMessage.content)) {
      text = lastMessage.content
        .map((part: any) => part.text ?? "")
        .join("");
    }
  }

  return Response.json({ text });
}
