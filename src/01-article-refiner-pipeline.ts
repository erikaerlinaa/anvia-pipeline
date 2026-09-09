// Task 01: Draft -> Critique -> Rewrite article refiner pipeline
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { Studio } from "@anvia/studio";
import { draftArticle, critiqueDraft, rewriteArticle } from "./service.js";

const ArticleInputSchema = z.object({
  topic: z.string(),
});

// 1. Draft   -> write the first-pass article
// 2. Critique -> review the draft and point out weaknesses
// 3. Rewrite  -> rewrite the draft, addressing the critique

const articleRefiner = new Pipeline({
  id: "article-refiner",
  inputSchema: ArticleInputSchema,
})
  .step({
    id: "draft",
    run: async (context) => {
      const topic = context.input.topic;
      const { draft } = await draftArticle(topic);
      return { topic, draft };
    },
  })
  .step({
    id: "critique",
    run: async (context) => {
      const { topic, draft } = context.input;
      const { critique } = await critiqueDraft(draft);
      return { topic, draft, critique };
    },
  })
  .step({
    id: "rewrite",
    run: async (context) => {
      const { draft, critique } = context.input;
      const { finalArticle } = await rewriteArticle(draft, critique);
      return finalArticle;
    },
  });

new Studio([articleRefiner]).start();
