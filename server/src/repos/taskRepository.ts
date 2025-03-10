//CONTEM INTERAÇÕES COM BANCO DE DADOS

import { Task } from "../models/types";

let tasks: Task[] = [];

export const createTask = (task: Task) => {
  tasks.push(task);
};

export const findTaskById = (id: string): Task | undefined => {
  return tasks.find((task) => task.id === id);
};

export const updateTask = (
  id: string,
  updatedTask: Partial<Task>
): Task | undefined => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) return undefined;

  tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
};

export const deleteTask = (id: string): Task | undefined => {
  const taskIndex = tasks.findIndex((task) => task.id === id);
  if (taskIndex === -1) return undefined;
};

export const getAllTasks = (): Task[] => {
  return tasks.filter((task) => !task.deleted);
};
