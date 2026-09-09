import { generateCompletion } from "@anvia/core";
import z from "zod";
import { model } from "./models.js";

export const TicketSchema = z.object({
  summary: z.string(),
  category: z.enum(["billing", "technical", "account", "other"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  sentiment: z.enum(["neutral", "frustrated", "angry"]),
});

export type Ticket = z.infer<typeof TicketSchema>;

const EXTRACT_TICKET_INSTRUCTION = `
  You are a support ticket triage system.
  Read the raw incoming ticket text and extract the structured fields
  required by the schema:

  - summary: one sentence summarizing the issue
  - category: billing, technical, account, or other
  - priority: low, medium, high, or urgent (based on business/customer impact)
  - sentiment: the customer's tone (neutral, frustrated, or angry)
  `;

export async function extractTicket(ticketText: string): Promise<Ticket> {
  const result = await generateCompletion({
    model,
    instructions: EXTRACT_TICKET_INSTRUCTION,
    prompt: `Raw ticket:\n\n${ticketText}`,
    outputSchema: TicketSchema,
  });

  return result.output;
}

export type Route = {
  queue: "on-call-engineer" | "support-queue" | "backlog";
  slaHours: number;
};

export function routeByPriority(priority: Ticket["priority"]): Route {
  switch (priority) {
    case "urgent":
      return { queue: "on-call-engineer", slaHours: 1 };
    case "high":
      return { queue: "on-call-engineer", slaHours: 4 };
    case "medium":
      return { queue: "support-queue", slaHours: 24 };
    case "low":
      return { queue: "backlog", slaHours: 72 };
  }
}
