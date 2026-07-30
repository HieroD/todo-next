import z from "zod";

// tasks validation
export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
});