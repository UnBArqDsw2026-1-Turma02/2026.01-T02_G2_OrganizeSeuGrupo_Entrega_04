// Camada de serviço dos grupos.
//
// Concentra as REGRAS DE NEGÓCIO e o acesso à persistência, mantendo os
// controllers finos (responsáveis apenas pelo protocolo HTTP). Espelha a
// separação controller → service adotada na arquitetura da Entrega 03 (NestJS),
// preservando a stack Express desta entrega.
//
// A fonte de dados ainda é o mock em memória (`data/grupos`); quando houver
// banco, apenas este arquivo precisa mudar — controllers e rotas permanecem.
import { grupos } from "../data/grupos";
import { Grupo } from "../models/Grupo";

// Dados de entrada para criar um grupo, refletindo o body do `POST /grupos`
// e os campos do modal "Criar Novo Grupo" (Figma node 73:5791).
export interface NovoGrupoInput {
  nome: unknown;
  categoria: unknown;
  icone?: unknown;
  cor?: unknown;
}

// Resultado da criação: ou os erros de validação, ou o grupo criado.
// Permite que o controller traduza o desfecho em status HTTP (400 x 201)
// sem conhecer as regras de negócio.
export type ResultadoCriacao =
  | { ok: false; erros: string[] }
  | { ok: true; grupo: Grupo };

// Cor padrão do avatar quando o modal não envia uma cor.
const COR_PADRAO = "#0fa3b1";

// Retorna todos os grupos exibidos na tela "Meus Grupos".
export function listarGrupos(): Grupo[] {
  return grupos;
}

// Cria um novo grupo aplicando validação, geração de id e valores padrão.
// Não lida com HTTP — devolve um resultado que o controller traduz em resposta.
export function criarGrupo(input: NovoGrupoInput): ResultadoCriacao {
  const { nome, categoria, icone, cor } = input;

  // Validação dos campos obrigatórios e dos opcionais (quando enviados).
  const erros: string[] = [];
  if (typeof nome !== "string" || nome.trim() === "") {
    erros.push("O campo 'nome' é obrigatório.");
  }
  if (typeof categoria !== "string" || categoria.trim() === "") {
    erros.push("O campo 'categoria' é obrigatório.");
  }
  if (icone !== undefined && (typeof icone !== "string" || icone.trim() === "")) {
    erros.push("O campo 'icone', quando informado, deve ser uma string não-vazia.");
  }
  if (cor !== undefined && (typeof cor !== "string" || cor.trim() === "")) {
    erros.push("O campo 'cor', quando informado, deve ser uma string não-vazia.");
  }
  if (erros.length > 0) {
    return { ok: false, erros };
  }

  // A partir daqui nome/categoria são strings não-vazias (garantido acima).
  const nomeValido = (nome as string).trim();
  const categoriaValida = (categoria as string).trim();

  // Gera o próximo id sequencial com base nos grupos existentes.
  const proximoId =
    (grupos.reduce((maior, g) => Math.max(maior, Number(g.id)), 0) + 1).toString();

  // Monta o grupo. A categoria do modal alimenta o campo `disciplina`.
  // Demais campos não presentes no modal recebem valores padrão.
  const novoGrupo: Grupo = {
    id: proximoId,
    nome: nomeValido,
    disciplina: categoriaValida,
    descricao: "",
    tags: [],
    membros: 1,
    proximaReuniao: "",
    cor: typeof cor === "string" && cor.trim() !== "" ? cor.trim() : COR_PADRAO,
    favorito: false,
  };

  // `icone` é opcional: só inclui no grupo quando informado.
  if (typeof icone === "string" && icone.trim() !== "") {
    novoGrupo.icone = icone.trim();
  }

  grupos.push(novoGrupo);
  return { ok: true, grupo: novoGrupo };
}
