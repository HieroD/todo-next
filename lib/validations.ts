import z from "zod";
import { TaskStatus } from "./types";

// tasks validation
export const createTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().min(1),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().min(1).optional(),
  status: z.enum(TaskStatus).optional(),
});
