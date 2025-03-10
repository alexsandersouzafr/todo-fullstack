import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const router = express.Router();

interface Task {
  id: string;
  name: string;
  done: boolean;
  createdAt: Date;
  doneAt: Date | null;
  deleted: boolean;
}

let tasks: Task[] = [];

// Esquemas de validação com Zod
const nameSchema = z.object({
  name: z
    .string()
    .min(1, "O nome da tarefa é obrigatório e deve ser uma string."),
});

const idSchema = z.object({
  id: z.string().min(1, "O ID é obrigatório e deve ser uma string."),
});

const taskFormSchema = z.object({
  id: z.string().min(1, "O ID é obrigatório e deve ser uma string."),
  name: z
    .string()
    .min(1, "O nome da tarefa é obrigatório e deve ser uma string."),
});

// Rota para listar tarefas
router.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = {
      status: 200,
      data: tasks.filter((task) => !task.deleted),
      message: "Tasks retrieved successfully.",
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// Rota para adicionar uma tarefa
router.post("/add", (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = nameSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        status: 400,
        errors: validationResult.error.errors,
        message: "Validation failed!",
      });
    }

    const newTask: Task = {
      id: uuidv4(),
      name: req.body.name,
      done: false,
      createdAt: new Date(),
      doneAt: null,
      deleted: false,
    };

    tasks.push(newTask);

    res.status(201).json({
      status: 201,
      data: tasks,
      message: "Task added successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// Rota para marcar uma tarefa como concluída
router.put("/done", (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = idSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        status: 400,
        errors: validationResult.error.errors,
        message: "Validation failed!",
      });
    }

    const currentTask = tasks.find((task) => task.id === req.body.id);

    tasks = tasks.map((task) =>
      task.id === req.body.id
        ? {
            ...task,
            done: !currentTask!.done,
            doneAt: !task.done ? new Date() : null,
          }
        : task
    );

    res.status(200).json({
      status: 200,
      data: tasks,
      message: "Task updated successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// Rota para editar uma tarefa
router.put("/edit", (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = taskFormSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        status: 400,
        errors: validationResult.error.errors,
        message: "Failed to update task.",
      });
    }

    tasks = tasks.map((task) =>
      task.id === req.body.id ? { ...task, name: req.body.name } : task
    );

    res.status(200).json({
      status: 200,
      data: tasks,
      message: "Task updated successfully.",
    });
  } catch (error) {
    next(error);
  }
});

// Rota para deletar uma tarefa (soft delete)
router.delete("/delete", (req: Request, res: Response, next: NextFunction) => {
  try {
    const validationResult = idSchema.safeParse(req.body);
    if (!validationResult.success) {
      res.status(400).json({
        status: 400,
        errors: validationResult.error.errors,
        message: "Failed to delete task.",
      });
    }

    tasks = tasks.map((task) =>
      task.id === req.body.id ? { ...task, deleted: true } : task
    );

    res.status(200).json({
      status: 200,
      data: tasks.filter((task) => !task.deleted),
      message: "Task deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

export default router;
