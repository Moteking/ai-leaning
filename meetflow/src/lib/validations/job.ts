import { z } from "zod";

export const jobInputSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(30).max(10000),
  requiredSkills: z.array(z.string().min(1).max(80)).max(30),
  salaryMin: z.number().int().min(1).max(100000),
  salaryMax: z.number().int().min(1).max(100000),
  workStyle: z.enum(["REMOTE", "HYBRID", "ONSITE", "FLEXIBLE"]),
  status: z.enum(["ACTIVE", "PAUSED", "CLOSED"]).optional(),
});

export type JobInput = z.infer<typeof jobInputSchema>;
