import express from "express";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

const router = express.Router();

let users = [];

type User = { id: string; userName: string; password: string };

const userSchema = z.object({
  userName: z.string().email(),
  password: z.string().min(6),
});

router.post("/signup", (req, res, next) => {
  const validationResult = userSchema.safeParse(req.body);
  if (!validationResult.success) {
    res.status(400).json({
      status: 400,
      errors: validationResult.error.errors,
      message: "Validation failed!",
    });
    return;
  }
});

export default router;
