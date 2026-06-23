// Tokens de cor extraídos do arquivo Figma (ORGANIZE SEU GRUPO).
// Reúne as cores de layout da tela "Meus Grupos" (node 48:1680) e a paleta
// de avatares do modal "Criar Novo Grupo" (node 73:5791).

export const cores = {
  // Layout
  fundo: "#f7f7f2", // bege claro de fundo da tela
  card: "#ffffff", // fundo dos cards
  borda: "#ececec", // bordas/divisórias sutis
  textoPrincipal: "#1d2d44", // títulos
  textoSecundario: "#6b7280", // subtítulos/descrições
  textoSuave: "#9ca3af", // ícones/textos discretos

  // Marca
  primaria: "#0fa3b1", // teal principal
  primariaSuave: "#dff3f4", // fundo de botões/realces (ex.: "Abrir")

  // Feedback de sucesso (toast "Grupo criado com sucesso!" — node 191:1162)
  sucessoFundo: "#ecfdf3", // fundo do toast
  sucessoBorda: "#bffcd9", // borda do toast
  sucessoTexto: "#008a2e", // texto/ícone do toast

  // Sobreposição (overlay) de modais
  overlay: "rgba(0,0,0,0.5)",

  // Paleta de avatares (modal "Criar Novo Grupo")
  azul: "#0fa3b1",
  azulEscuro: "#1d2d44",
  dourado: "#ccba7b",
  vermelho: "#d4183d",
  verde: "#00bc7d",
  roxo: "#8e51ff",
  laranja: "#ff6900",
  rosa: "#f6339a",
} as const;

// Espaçamentos base (múltiplos de 4) para manter consistência.
export const espacos = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;
