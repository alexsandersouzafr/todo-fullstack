//DEFINE ENDING POINTS

import express from "express";
import * as taskControllers from "../controllers/taskControllers";

const router = express.Router();

router.get("/", taskControllers.getAllTasks);
router.post("/add", taskControllers.addTask);
router.put("/done", taskControllers.markTaskAsDone);
router.put("/edit", taskControllers.updateTaskName);
router.delete("/delete", taskControllers.deleteTask);

export default router;
