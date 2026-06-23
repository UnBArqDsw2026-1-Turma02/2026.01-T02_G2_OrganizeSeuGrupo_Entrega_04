// Tipo de um grupo de estudos, espelhando o model do backend
// (implementacao/mobile/backend/src/models/Grupo.ts).
// Mantém os mesmos campos retornados por `GET /grupos`.
export interface Grupo {
  id: string;
  nome: string;
  disciplina: string;
  descricao: string;
  tags: string[];
  membros: number;
  proximaReuniao: string;
  cor: string;
  icone?: string;
  favorito: boolean;
}

// Dados enviados ao backend para criar um grupo, espelhando o body do
// `POST /grupos` e os campos do modal "Criar Novo Grupo" (Figma node 73:5791):
//   - nome      (obrigatório)
//   - categoria (obrigatório) — alimenta o campo `disciplina` do grupo
//   - icone     (opcional)
//   - cor       (opcional)
export interface NovoGrupoInput {
  nome: string;
  categoria: string;
  icone?: string;
  cor?: string;
}
