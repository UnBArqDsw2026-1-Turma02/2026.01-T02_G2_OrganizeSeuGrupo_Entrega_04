import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Grupo } from "../types/Grupo";
import { cores, espacos } from "../theme/tokens";

// Mapeia o identificador de ícone vindo do backend (campo `icone`, definido no
// modal "Criar Novo Grupo") para um glyph do MaterialCommunityIcons.
const ICONES: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
  livro: "book-open-variant",
  book: "book-open-variant",
  code: "code-tags",
  atom: "atom",
  globe: "earth",
  palette: "palette",
  brain: "brain",
  music: "music",
  camera: "camera",
};

// Cores de fundo/texto das tags conhecidas; demais usam um cinza neutro.
function corDaTag(tag: string): { fundo: string; texto: string } {
  switch (tag.toLowerCase()) {
    case "urgente":
      return { fundo: "#fde7ec", texto: cores.vermelho };
    case "prova":
      return { fundo: "#f3ecd6", texto: "#8a6d2f" };
    case "resumo":
      return { fundo: cores.primariaSuave, texto: cores.primaria };
    default:
      return { fundo: "#eef0f2", texto: cores.textoSecundario };
  }
}

interface GrupoCardProps {
  grupo: Grupo;
  // Ação ao tocar em "Abrir" (navegação será ligada em telas futuras).
  onAbrir?: (grupo: Grupo) => void;
}

// Card de um grupo na listagem "Meus Grupos" (Figma node 48:1680).
export function GrupoCard({ grupo, onAbrir }: GrupoCardProps): JSX.Element {
  const icone: keyof typeof MaterialCommunityIcons.glyphMap =
    (grupo.icone ? ICONES[grupo.icone] : undefined) ?? "book-open-variant";

  return (
    <View style={styles.card}>
      <View style={styles.topo}>
        {/* Avatar colorido com o ícone do grupo */}
        <View style={[styles.avatar, { backgroundColor: grupo.cor }]}>
          <MaterialCommunityIcons name={icone} size={24} color="#ffffff" />
        </View>

        <View style={styles.conteudo}>
          <View style={styles.linhaTitulo}>
            <Text style={styles.nome} numberOfLines={1}>
              {grupo.nome}
            </Text>
            {grupo.favorito ? (
              <MaterialCommunityIcons name="crown" size={18} color={cores.dourado} />
            ) : (
              <MaterialCommunityIcons
                name="account-outline"
                size={18}
                color={cores.textoSuave}
              />
            )}
          </View>

          <Text style={styles.disciplina}>{grupo.disciplina}</Text>

          {grupo.descricao ? (
            <Text style={styles.descricao}>{grupo.descricao}</Text>
          ) : null}

          {grupo.tags.length > 0 ? (
            <View style={styles.tags}>
              {grupo.tags.map((tag) => {
                const { fundo, texto } = corDaTag(tag);
                return (
                  <View key={tag} style={[styles.tag, { backgroundColor: fundo }]}>
                    <Text style={[styles.tagTexto, { color: texto }]}>{tag}</Text>
                  </View>
                );
              })}
            </View>
          ) : null}
        </View>
      </View>

      {/* Rodapé do card: membros + próxima reunião e botão "Abrir" */}
      <View style={styles.rodape}>
        <View style={styles.metaInfo}>
          <MaterialCommunityIcons
            name="account-multiple-outline"
            size={16}
            color={cores.textoSecundario}
          />
          <Text style={styles.metaTexto}>{grupo.membros}</Text>
          {grupo.proximaReuniao ? (
            <Text style={styles.metaTexto}>· Próxima: {grupo.proximaReuniao}</Text>
          ) : null}
        </View>

        <Pressable
          style={styles.botaoAbrir}
          onPress={() => onAbrir?.(grupo)}
          accessibilityRole="button"
          accessibilityLabel={`Abrir grupo ${grupo.nome}`}
        >
          <Text style={styles.botaoAbrirTexto}>Abrir</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: cores.card,
    borderRadius: 16,
    padding: espacos.lg,
    marginBottom: espacos.md,
    // sombra sutil (iOS) + elevação (Android)
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  topo: {
    flexDirection: "row",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: espacos.md,
  },
  conteudo: {
    flex: 1,
  },
  linhaTitulo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  nome: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: cores.textoPrincipal,
    marginRight: espacos.sm,
  },
  disciplina: {
    fontSize: 12,
    color: cores.textoSuave,
    marginTop: 2,
  },
  descricao: {
    fontSize: 13,
    color: cores.textoSecundario,
    marginTop: espacos.sm,
    lineHeight: 18,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: espacos.md,
    gap: espacos.sm,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagTexto: {
    fontSize: 11,
    fontWeight: "600",
  },
  rodape: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: espacos.lg,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
    gap: espacos.xs,
  },
  metaTexto: {
    fontSize: 12,
    color: cores.textoSecundario,
  },
  botaoAbrir: {
    backgroundColor: cores.primariaSuave,
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.sm,
    borderRadius: 999,
    marginLeft: espacos.sm,
  },
  botaoAbrirTexto: {
    color: cores.primaria,
    fontSize: 13,
    fontWeight: "600",
  },
});
