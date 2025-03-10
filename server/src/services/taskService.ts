//CONTÉM LÓGICAS DE NEGÓCIO

import { v4 as uuidv4 } from "uuid";
import { Task } from "../models/types";
import * as taskRepository from "../repos/taskRepository";

export const addTask = (name: string) => {
  const newTask: Task = {
    id: uuidv4(),
    name,
    done: false,
    createdAt: new Date(),
    doneAt: null,
    deleted: false,
  };
  taskRepository.createTask(newTask);
};

export const markTaskAsDone = (id: string) => {
  const task = taskRepository.findTaskById(id);
  if (!task) return undefined;
  taskRepository.updateTask(id, {
    done: !task?.done,
    doneAt: !task.done ? new Date() : null,
  });
};

export const updateTaskName = (id: string, name: string) => {
  taskRepository.updateTask(id, {
    name: name,
    done: false,
  });
};

export const deleteTask = (id: string) => {
  taskRepository.deleteTask(id);
};
