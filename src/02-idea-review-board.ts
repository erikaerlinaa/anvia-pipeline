// Task 02: Idea Review Board
// Fan-out a startup pitch to CEO, Analyst, and CTO branches, then fan-in
// (merge) the verdicts into one final board decision.

import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { Studio } from "@anvia/studio";
import {
  ANALYST_INSTRUCTION,
  CEO_INSTRUCTION,
  CTO_INSTRUCTION,
  MERGE_VERDICT_INSTRUCTION,
  reviewPitch,
} from "./service-idea-review.js";

const PitchInputSchema = z.object({
  pitch: z.string(),
});

const ceoBranch = new Pipeline({
  id: "ceo-branch",
  inputSchema: PitchInputSchema,
}).step({
  id: "ceo-review",
  run: async (context) => reviewPitch(context.input.pitch, CEO_INSTRUCTION),
});

const analystBranch = new Pipeline({
  id: "analyst-branch",
  inputSchema: PitchInputSchema,
}).step({
  id: "analyst-review",
  run: async (context) =>
    reviewPitch(context.input.pitch, ANALYST_INSTRUCTION),
});

const ctoBranch = new Pipeline({
  id: "cto-branch",
  inputSchema: PitchInputSchema,
}).step({
  id: "cto-review",
  run: async (context) => reviewPitch(context.input.pitch, CTO_INSTRUCTION),
});

const ideaReviewBoard = new Pipeline({
  id: "idea-review-board",
  inputSchema: PitchInputSchema,
})
  .parallel({
    id: "gather-verdicts",
    branches: {
      ceo: ceoBranch,
      analyst: analystBranch,
      cto: ctoBranch,
    },
  })
  .step({
    id: "merge-verdicts",
    run: async (context) => {
      const { ceo, analyst, cto } = context.input;

      const VERDICTS = `
      CEO verdict:
      <ceo-verdict>
      ${ceo}
      </ceo-verdict>

      Business Analyst verdict:
      <analyst-verdict>
      ${analyst}
      </analyst-verdict>

      CTO verdict:
      <cto-verdict>
      ${cto}
      </cto-verdict>
      `;

      return reviewPitch(VERDICTS, MERGE_VERDICT_INSTRUCTION);
    },
  });

new Studio([ideaReviewBoard]).start();
