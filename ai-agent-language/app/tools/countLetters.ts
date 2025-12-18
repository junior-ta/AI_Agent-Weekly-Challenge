import { z } from "zod";
import { tool } from "ai";

export const countLettersTool = tool({
  description:"Use ONLY when the user explicitly asks to count occurrences of a specific letter in a provided text. Not for normal conversation.",
  inputSchema: z.object({
    letter: z.string().min(1).max(1).describe("The single letter to count"),
    text: z.string().describe("The text to scan"),
  }),
  execute: async ({ letter, text }) => {
    const target = letter.toLowerCase();
    const count = [...text].filter((ch) => ch.toLowerCase() === target).length;
    return { count };
  },
});
