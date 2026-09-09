import { generateCompletion } from "@anvia/core";
import { model } from "./models.js";

export async function reviewPitch(pitch: string, instructions: string) {
  const result = await generateCompletion({
    model,
    instructions,
    prompt: `Startup pitch: ${pitch}`,
  });

  return result.output;
}

export const CEO_INSTRUCTION = `
  You are a CEO reviewing a startup pitch from a vision & strategy perspective.
  Focus on: market fit, long-term vision, and whether this is worth pursuing.
  `;

export const ANALYST_INSTRUCTION = `
  You are a Business Analyst reviewing a startup pitch.
  Focus on: business model viability, revenue potential, and competitive landscape.
  `;

export const CTO_INSTRUCTION = `
  You are a CTO reviewing a startup pitch from a technical feasibility perspective.
  Focus on: technical complexity, build effort, and key engineering risks.
  `;

export const MERGE_VERDICT_INSTRUCTION = `
  You are the review board secretary. You will receive verdicts from the CEO,
  the Business Analyst, and the CTO about a startup pitch.
  Your task is to merge them into one final board verdict that includes:

  - Overall go / no-go recommendation
  - Summary of each perspective (CEO, Analyst, CTO)
  - Top 3 action items for the founder
  `;
