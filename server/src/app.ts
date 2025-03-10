import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import indexRouter from "./routes/index";
import authRouter from "./routes/auth";

const app = express();

// Configuração do view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Rotas
app.use("/", indexRouter);
app.use("/auth", authRouter);

// Captura de erro 404 e encaminhamento para o manipulador de erros
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// Manipulador de erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Define variáveis locais, fornecendo o erro apenas em desenvolvimento
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Renderiza a página de erro
  res.status(err.status || 500);
  res.render("error");
});

export default app;
