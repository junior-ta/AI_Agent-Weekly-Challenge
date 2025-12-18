import { streamText, stepCountIs } from "ai";
import { ollama } from 'ollama-ai-provider-v2';
import { countLettersTool } from "@/app/tools/countLetters";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: ollama("llama3.1"), //'openai/gpt-5'
    messages,
    tools: {
      countLetters: countLettersTool,
    },
    system: `
You are a helpful conversational assistant.

You have access to tools, but you should ONLY use them silently
when a task requires exact, deterministic computation on text
(such as counting letters, characters, or exact matches).

For normal conversation, explanations, opinions, or creative replies:
- DO NOT mention tools
- DO NOT suggest tools
- Respond naturally like a normal chatbot

Never say that a tool "can help" unless you are actively using it.
If you do not need a tool, behave as if no tools exist.
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
