import { generateCompletion } from "@anvia/core";
import { model } from "./models.js";
import z from "zod";

const DraftSchema = z.object({
  draft: z.string(),
});

const CritiqueSchema = z.object({
  critique: z.string(),
});

const RewriteSchema = z.object({
  finalArticle: z.string(),
});

const DRAFT_INSTRUCTION = `
  You are an expert article writer.
  Your task is to write a first-pass draft article about the given topic.
  Keep it focused, well-structured, and around 3-5 paragraphs.
  `;

export async function draftArticle(topic: string) {
  const result = await generateCompletion({
    model,
    instructions: DRAFT_INSTRUCTION,
    prompt: `Write a draft article about: ${topic}`,
    outputSchema: DraftSchema,
  });

  return result.output;
}

const CRITIQUE_INSTRUCTION = `
  You are a strict editor reviewing an article draft.
  Your task is to critique the draft: point out weaknesses in clarity,
  structure, argumentation, and style. Be specific and actionable.
  `;

export async function critiqueDraft(draft: string) {
  const result = await generateCompletion({
    model,
    instructions: CRITIQUE_INSTRUCTION,
    prompt: `Critique this draft article:\n\n${draft}`,
    outputSchema: CritiqueSchema,
  });

  return result.output;
}

const REWRITE_INSTRUCTION = `
  You are an expert article writer performing a final rewrite.
  You will receive the original draft and an editor's critique.
  Your task is to rewrite the article, addressing every point raised
  in the critique while preserving the original intent and topic.
  `;

export async function rewriteArticle(draft: string, critique: string) {
  const result = await generateCompletion({
    model,
    instructions: REWRITE_INSTRUCTION,
    prompt: `Original draft:\n\n${draft}\n\nEditor critique:\n\n${critique}\n\nRewrite the article addressing the critique.`,
    outputSchema: RewriteSchema,
  });

  return result.output;
}
