import { z } from "zod";
import { tool } from "ai";

export const countLettersTool = tool({
  description: "Count how many times a given letter appears in a word or phrase.",
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
