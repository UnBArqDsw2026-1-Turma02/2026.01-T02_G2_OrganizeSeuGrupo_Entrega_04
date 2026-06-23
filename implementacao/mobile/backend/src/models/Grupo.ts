// Model que representa um grupo de estudos exibido na listagem "Meus Grupos".
// Os campos refletem os dados mostrados em cada card da tela (Figma node 48:1680).
export interface Grupo {
  // Identificador único do grupo.
  id: string;
  // Título do grupo (ex.: "Cálculo I").
  nome: string;
  // Disciplina/categoria associada (ex.: "Matemática", "Computação").
  disciplina: string;
  // Descrição curta exibida no card.
  descricao: string;
  // Etiquetas exibidas no card (ex.: "Urgente", "Prova", "Resumo").
  tags: string[];
  // Quantidade de membros do grupo (ícone de pessoas + número).
  membros: number;
  // Texto da próxima reunião exibido no card (ex.: "Hoje, 14:00").
  proximaReuniao: string;
  // Cor de destaque do avatar/ícone do grupo (hex).
  cor: string;
  // Ícone escolhido no modal "Criar Novo Grupo" (identificador do ícone). Opcional.
  icone?: string;
  // Indica se o grupo está marcado como favorito (ícone de coroa).
  favorito: boolean;
}
