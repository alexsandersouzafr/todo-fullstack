"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const uuid_1 = require("uuid");
const zod_1 = require("zod");
const router = express_1.default.Router();
let tasks = [];
// Esquemas de validação com Zod
const nameSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, "O nome da tarefa é obrigatório e deve ser uma string."),
});
const idSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "O ID é obrigatório e deve ser uma string."),
});
const taskFormSchema = zod_1.z.object({
    id: zod_1.z.string().min(1, "O ID é obrigatório e deve ser uma string."),
    name: zod_1.z
        .string()
        .min(1, "O nome da tarefa é obrigatório e deve ser uma string."),
});
// Rota para listar tarefas
router.get("/", (req, res, next) => {
    try {
        const response = {
            status: 200,
            data: tasks.filter((task) => !task.deleted),
            message: "Tasks retrieved successfully.",
        };
        res.json(response);
    }
    catch (error) {
        next(error);
    }
});
// Rota para adicionar uma tarefa
router.post("/add", (req, res, next) => {
    try {
        const validationResult = nameSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                status: 400,
                errors: validationResult.error.errors,
                message: "Validation failed!",
            });
        }
        const newTask = {
            id: (0, uuid_1.v4)(),
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
    }
    catch (error) {
        next(error);
    }
});
// Rota para marcar uma tarefa como concluída
router.put("/done", (req, res, next) => {
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
        tasks = tasks.map((task) => task.id === req.body.id
            ? Object.assign(Object.assign({}, task), { done: !currentTask.done, doneAt: !task.done ? new Date() : null }) : task);
        res.status(200).json({
            status: 200,
            data: tasks,
            message: "Task updated successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
// Rota para editar uma tarefa
router.put("/edit", (req, res, next) => {
    try {
        const validationResult = taskFormSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                status: 400,
                errors: validationResult.error.errors,
                message: "Failed to update task.",
            });
        }
        tasks = tasks.map((task) => task.id === req.body.id ? Object.assign(Object.assign({}, task), { name: req.body.name }) : task);
        res.status(200).json({
            status: 200,
            data: tasks,
            message: "Task updated successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
// Rota para deletar uma tarefa (soft delete)
router.delete("/delete", (req, res, next) => {
    try {
        const validationResult = idSchema.safeParse(req.body);
        if (!validationResult.success) {
            res.status(400).json({
                status: 400,
                errors: validationResult.error.errors,
                message: "Failed to delete task.",
            });
        }
        tasks = tasks.map((task) => task.id === req.body.id ? Object.assign(Object.assign({}, task), { deleted: true }) : task);
        res.status(200).json({
            status: 200,
            data: tasks.filter((task) => !task.deleted),
            message: "Task deleted successfully.",
        });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
