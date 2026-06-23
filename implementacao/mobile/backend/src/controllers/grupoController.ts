import { Request, Response } from "express";
import * as grupoService from "../services/grupoService";

// Controllers finos: cuidam apenas do protocolo HTTP (ler a requisição e
// montar a resposta). As regras de negócio ficam em `services/grupoService`.

// GET /grupos — retorna a lista de grupos exibida na tela "Meus Grupos".
export function listarGrupos(_req: Request, res: Response): void {
  res.status(200).json(grupoService.listarGrupos());
}

// POST /grupos — cria um novo grupo a partir do modal "Criar Novo Grupo".
// Reflete os campos do modal (Figma node 73:5791): nome e categoria
// obrigatórios; icone e cor opcionais. A validação/criação fica no serviço.
export function criarGrupo(req: Request, res: Response): void {
  const { nome, categoria, icone, cor } = req.body ?? {};

  const resultado = grupoService.criarGrupo({ nome, categoria, icone, cor });
  if (!resultado.ok) {
    res.status(400).json({ erros: resultado.erros });
    return;
  }

  res.status(201).json(resultado.grupo);
}
