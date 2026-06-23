// Ponto de entrada do backend (Express).
import express, { NextFunction, Request, Response } from "express";
import grupoRoutes from "./routes/grupoRoutes";

const app = express();
const PORT = process.env.PORT ?? 3000;

// CORS mínimo (sem dependência externa): permite que o front em Expo Web
// consuma a API e responde ao preflight do POST com Content-Type JSON.
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json());

// Rotas da aplicação.
app.use(grupoRoutes);

// 404 — rota não mapeada. Mantém o contrato JSON (em vez do HTML padrão do Express).
app.use((_req: Request, res: Response) => {
  res.status(404).json({ erro: "Recurso não encontrado." });
});

// Tratador de erros — DEVE ter 4 parâmetros para o Express reconhecê-lo.
// Captura o JSON malformado lançado por `express.json()` (entity.parse.failed)
// e qualquer falha inesperada, sempre respondendo em JSON.
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err && (err as { type?: string }).type === "entity.parse.failed") {
    res.status(400).json({ erros: ["Corpo da requisição não é um JSON válido."] });
    return;
  }
  console.error(err);
  res.status(500).json({ erro: "Erro interno do servidor." });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
