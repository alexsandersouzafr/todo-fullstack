const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { body, validationResult } = require("express-validator");
const router = express.Router();

let tasks = [];

const validateTask = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("O nome da tarefa é obrigatório e deve ser uma string."),
];

const validadeDone = [
  body("id").isString().notEmpty().withMessage("O valor precisa ser booleano."),
];

router.get("/", (req, res, next) => {
  try {
    const response = {
      status: 200,
      data: tasks.filter((task) => !task.deleted),
      message: "Tasks retrieved succesfully.",
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.post("/add", validateTask, (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        status: 400,
        errors: errors.array(),
        message: "Validation failed!",
      });

    const newTask = {
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

router.put("/done", validadeDone, (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({
        status: 400,
        errors: errors.array(),
        message: "Validation failed!",
      });

    const currentTask = tasks.find((task) => task.id === req.body.id);

    tasks = tasks.map((task) =>
      task.id === req.body.id
        ? {
            ...task,
            done: !currentTask.done,
            doneAt: !task.done ? new Date() : null,
          }
        : task
    );

    res.status(200).json({
      status: 201,
      data: tasks,
      message: "Task updated successfully.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
