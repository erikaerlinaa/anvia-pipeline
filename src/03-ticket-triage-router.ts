// Task 03: Ticket Triage Router
// Extract typed ticket fields behind a schema gate, then route by priority
// in plain TypeScript.
//
//   ticket -> schema (step) -> route (step)
import { Pipeline } from "@anvia/core/pipeline";
import z from "zod";
import { Studio } from "@anvia/studio";
import { extractTicket, routeByPriority } from "./service-ticket-triage.js";

const TicketInputSchema = z.object({
  ticketText: z.string(),
});

const ticketTriageRouter = new Pipeline({
  id: "ticket-triage-router",
  inputSchema: TicketInputSchema,
})
  .step({
    id: "schema",
    run: async (context) => {
      const ticket = await extractTicket(context.input.ticketText);
      return ticket;
    },
  })
  .step({
    id: "route",
    run: async (context) => {
      const ticket = context.input;
      const route = routeByPriority(ticket.priority);

      return { ticket, route };
    },
  });

new Studio([ticketTriageRouter]).start();
