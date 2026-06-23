import { API_BASE_URL } from "../config";
import { Grupo, NovoGrupoInput } from "../types/Grupo";

// Serviço de acesso aos grupos no backend.
// Concentra as chamadas HTTP para que os componentes não conheçam detalhes da API.

// GET /grupos — retorna a lista de grupos exibida na tela "Meus Grupos".
// Lança Error em caso de falha de rede ou resposta com status diferente de 2xx,
// para que a camada de UI possa exibir o estado de erro.
export async function listarGrupos(): Promise<Grupo[]> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_BASE_URL}/grupos`);
  } catch {
    // Falha de rede (backend fora do ar, URL errada, sem conexão).
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
  }

  if (!resposta.ok) {
    throw new Error(`Falha ao carregar os grupos (HTTP ${resposta.status}).`);
  }

  // Protege contra corpo vazio ou não-JSON, mesmo com status 2xx.
  try {
    return (await resposta.json()) as Grupo[];
  } catch {
    throw new Error("Resposta inválida do servidor ao carregar os grupos.");
  }
}

// POST /grupos — cria um novo grupo a partir do modal "Criar Novo Grupo".
// Em caso de 201, retorna o grupo recém-criado (já com id e defaults do backend).
// Lança Error com mensagem amigável em falha de rede, validação (400) ou outro status.
export async function criarGrupo(input: NovoGrupoInput): Promise<Grupo> {
  let resposta: Response;
  try {
    resposta = await fetch(`${API_BASE_URL}/grupos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    throw new Error("Não foi possível conectar ao servidor. Verifique sua conexão.");
  }

  // 400: o backend devolve { erros: string[] } com os campos inválidos.
  if (resposta.status === 400) {
    const corpo = (await resposta.json().catch(() => null)) as { erros?: string[] } | null;
    throw new Error(corpo?.erros?.join("\n") ?? "Dados inválidos. Verifique os campos.");
  }

  if (!resposta.ok) {
    throw new Error(`Falha ao criar o grupo (HTTP ${resposta.status}).`);
  }

  return (await resposta.json()) as Grupo;
}
