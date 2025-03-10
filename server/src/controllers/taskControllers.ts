//LIDA COM REQUISIÇÕES E RESPOSTAS

import { Request, Response, NextFunction } from "express";
import * as taskRepository from "../repos/taskRepository";
import * as taskService from "../services/taskService";
import { addTaskSchema, taskIdSchema, taskSchema } from "../models/shcemas";
import { validateRequest } from "../utils/validation";

const response = (status: number, message: string) => {
  return {
    status: status,
    data: taskRepository.getAllTasks(),
    message: message,
  };
};

export const getAllTasks = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.json(response(200, "Tasks retrieved successfully!"));
  } catch (error) {
    next(error);
  }
};

export const addTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = validateRequest(addTaskSchema, req.body);
    taskService.addTask(name);
    res.status(201).json(response(201, "Task added successfully!"));
  } catch (error) {
    next(error);
  }
};

export const markTaskAsDone = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = validateRequest(taskIdSchema, req.body);
    taskService.markTaskAsDone(id);
    res.status(200).json(response(200, "Task updated successfully!"));
  } catch (error) {
    next(error);
  }
};

export const updateTaskName = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, name } = validateRequest(taskSchema, req.body);
    taskService.updateTaskName(id, name);
    res.status(200).json(response(200, "Task updated successfully!"));
  } catch (error) {
    next(error);
  }
};

export const deleteTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = validateRequest(taskIdSchema, req.body);
    taskService.deleteTask(id);
    res.status(200).json(response(200, "Task deleted successfully!"));
  } catch (error) {
    next(error);
  }
};
