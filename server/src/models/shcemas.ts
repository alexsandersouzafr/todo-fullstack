import { z } from "zod";

export const taskSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "O nome da tarefa é obrigatório."),
});
export const addTaskSchema = taskSchema.pick({ name: true });
export const taskIdSchema = taskSchema.pick({ id: true });
