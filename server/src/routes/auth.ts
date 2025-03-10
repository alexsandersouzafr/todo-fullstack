import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const router = express.Router();

let users = [
  { id: uuidv4(), username: "fulano@internet.com", password: "123456" },
];

router.post("/signup", (req, res, next) => {
  //todo
});

export default router;
