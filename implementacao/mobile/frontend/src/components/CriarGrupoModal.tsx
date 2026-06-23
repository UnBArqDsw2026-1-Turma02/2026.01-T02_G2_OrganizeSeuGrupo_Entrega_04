import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { criarGrupo } from "../services/grupoService";
import { Grupo } from "../types/Grupo";
import { cores, espacos } from "../theme/tokens";

// Categorias oferecidas no dropdown (referência do modal — Figma node 73:6009).
const CATEGORIAS = ["Matemática", "Computação", "Física", "Idiomas", "Design"];

// Ícones selecionáveis. `chave` é o valor enviado ao backend (campo `icone`) e
// reconhecido pelo GrupoCard; `glyph` é o nome do MaterialCommunityIcons exibido.
const ICONES: { chave: string; glyph: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
  { chave: "livro", glyph: "book-open-variant" },
  { chave: "code", glyph: "code-tags" },
  { chave: "atom", glyph: "atom" },
  { chave: "globe", glyph: "earth" },
  { chave: "palette", glyph: "palette" },
  { chave: "brain", glyph: "brain" },
  { chave: "music", glyph: "music" },
  { chave: "camera", glyph: "camera" },
];

// Paleta de cores do avatar (Figma node 73:6084). Os valores vêm dos tokens.
const CORES_GRUPO: { nome: string; valor: string }[] = [
  { nome: "Azul", valor: cores.azul },
  { nome: "Azul Escuro", valor: cores.azulEscuro },
  { nome: "Dourado", valor: cores.dourado },
  { nome: "Vermelho", valor: cores.vermelho },
  { nome: "Verde", valor: cores.verde },
  { nome: "Roxo", valor: cores.roxo },
  { nome: "Laranja", valor: cores.laranja },
  { nome: "Rosa", valor: cores.rosa },
];

interface CriarGrupoModalProps {
  // Controla a visibilidade do modal.
  visivel: boolean;
  // Chamado ao cancelar/fechar sem criar.
  onFechar: () => void;
  // Chamado quando o POST retorna 201, com o grupo criado.
  onCriado: (grupo: Grupo) => void;
}

// Modal "Criar Novo Grupo" (Figma node 73:5791). Coleta nome, categoria, ícone
// e cor, e envia ao backend via POST /grupos. Em 201, dispara `onCriado`.
export function CriarGrupoModal({
  visivel,
  onFechar,
  onCriado,
}: CriarGrupoModalProps): JSX.Element {
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [iconeSelecionado, setIconeSelecionado] = useState(ICONES[0].chave);
  const [corSelecionada, setCorSelecionada] = useState(CORES_GRUPO[0].valor);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Reseta o formulário sempre que o modal é (re)aberto.
  useEffect(() => {
    if (visivel) {
      setNome("");
      setCategoria("");
      setIconeSelecionado(ICONES[0].chave);
      setCorSelecionada(CORES_GRUPO[0].valor);
      setDropdownAberto(false);
      setEnviando(false);
      setErro(null);
    }
  }, [visivel]);

  const podeEnviar = nome.trim() !== "" && categoria.trim() !== "" && !enviando;

  async function handleCriar() {
    if (!podeEnviar) {
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      const grupo = await criarGrupo({
        nome: nome.trim(),
        categoria,
        icone: iconeSelecionado,
        cor: corSelecionada,
      });
      onCriado(grupo);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro inesperado ao criar o grupo.");
      setEnviando(false);
    }
  }

  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
      onRequestClose={onFechar}
    >
      {/* Overlay escuro: tocar fora fecha o modal */}
      <Pressable style={styles.overlay} onPress={onFechar} />

      <View style={styles.sheet}>
        {/* Cabeçalho */}
        <View style={styles.cabecalho}>
          <View>
            <Text style={styles.tituloCabecalho}>Criar Novo Grupo</Text>
            <Text style={styles.subtituloCabecalho}>Organize seus estudos</Text>
          </View>
          <Pressable
            style={styles.botaoFechar}
            onPress={onFechar}
            accessibilityRole="button"
            accessibilityLabel="Fechar"
          >
            <MaterialCommunityIcons name="close" size={20} color={cores.textoPrincipal} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.formulario}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Nome do Grupo */}
          <View style={styles.campo}>
            <Text style={styles.rotulo}>Nome do Grupo *</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Ex: Cálculo I, Física Quântica..."
              placeholderTextColor={cores.textoSuave}
              returnKeyType="done"
            />
          </View>

          {/* Categoria (dropdown) */}
          <View style={styles.campo}>
            <Text style={styles.rotulo}>Categoria *</Text>
            <Pressable
              style={styles.dropdown}
              onPress={() => setDropdownAberto((aberto) => !aberto)}
              accessibilityRole="button"
              accessibilityLabel="Selecionar categoria"
            >
              <Text
                style={[
                  styles.dropdownTexto,
                  !categoria && styles.dropdownPlaceholder,
                ]}
              >
                {categoria || "Selecione uma categoria"}
              </Text>
              <MaterialCommunityIcons
                name={dropdownAberto ? "chevron-up" : "chevron-down"}
                size={20}
                color={cores.textoSecundario}
              />
            </Pressable>

            {dropdownAberto ? (
              <View style={styles.dropdownLista}>
                {CATEGORIAS.map((opcao) => {
                  const selecionada = opcao === categoria;
                  return (
                    <Pressable
                      key={opcao}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setCategoria(opcao);
                        setDropdownAberto(false);
                      }}
                      accessibilityRole="button"
                    >
                      <Text
                        style={[
                          styles.dropdownItemTexto,
                          selecionada && styles.dropdownItemTextoSelecionado,
                        ]}
                      >
                        {opcao}
                      </Text>
                      {selecionada ? (
                        <MaterialCommunityIcons
                          name="check"
                          size={18}
                          color={cores.primaria}
                        />
                      ) : null}
                    </Pressable>
                  );
                })}
              </View>
            ) : null}
          </View>

          {/* Ícone */}
          <View style={styles.campo}>
            <Text style={styles.rotulo}>Ícone</Text>
            <View style={styles.gridIcones}>
              {ICONES.map(({ chave, glyph }) => {
                const selecionado = chave === iconeSelecionado;
                return (
                  <Pressable
                    key={chave}
                    style={[styles.iconeBotao, selecionado && styles.iconeBotaoSelecionado]}
                    onPress={() => setIconeSelecionado(chave)}
                    accessibilityRole="button"
                    accessibilityLabel={`Ícone ${chave}`}
                    accessibilityState={{ selected: selecionado }}
                  >
                    <MaterialCommunityIcons
                      name={glyph}
                      size={24}
                      color={selecionado ? "#ffffff" : cores.textoPrincipal}
                    />
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Cor */}
          <View style={styles.campo}>
            <Text style={styles.rotulo}>Cor</Text>
            <View style={styles.gridCores}>
              {CORES_GRUPO.map(({ nome: nomeCor, valor }) => {
                const selecionada = valor === corSelecionada;
                return (
                  <Pressable
                    key={nomeCor}
                    style={[styles.corBotao, selecionada && styles.corBotaoSelecionada]}
                    onPress={() => setCorSelecionada(valor)}
                    accessibilityRole="button"
                    accessibilityLabel={`Cor ${nomeCor}`}
                    accessibilityState={{ selected: selecionada }}
                  >
                    <View style={[styles.corBolinha, { backgroundColor: valor }]} />
                    <Text style={styles.corTexto}>{nomeCor}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Mensagem de erro (validação/rede) */}
          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          {/* Ações */}
          <View style={styles.acoes}>
            <Pressable
              style={[styles.botao, styles.botaoCancelar]}
              onPress={onFechar}
              accessibilityRole="button"
            >
              <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[
                styles.botao,
                styles.botaoCriar,
                !podeEnviar && styles.botaoCriarDesabilitado,
              ]}
              onPress={handleCriar}
              disabled={!podeEnviar}
              accessibilityRole="button"
              accessibilityState={{ disabled: !podeEnviar }}
            >
              {enviando ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.botaoCriarTexto}>Criar Grupo</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: cores.overlay,
  },
  sheet: {
    marginTop: "auto",
    maxHeight: "92%",
    backgroundColor: cores.fundo,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.md,
    borderBottomWidth: 1,
    borderBottomColor: cores.borda,
  },
  tituloCabecalho: {
    fontSize: 18,
    fontWeight: "600",
    color: cores.textoPrincipal,
  },
  subtituloCabecalho: {
    fontSize: 12,
    color: cores.textoSecundario,
    marginTop: 2,
  },
  botaoFechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(204,186,123,0.3)",
  },
  formulario: {
    padding: espacos.lg,
    gap: espacos.xl,
  },
  campo: {
    gap: espacos.sm,
  },
  rotulo: {
    fontSize: 14,
    fontWeight: "600",
    color: cores.textoPrincipal,
  },
  input: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.md,
    fontSize: 16,
    color: cores.textoPrincipal,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.md,
  },
  dropdownTexto: {
    fontSize: 14,
    color: cores.textoPrincipal,
  },
  dropdownPlaceholder: {
    color: cores.textoSuave,
  },
  dropdownLista: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
    borderRadius: 14,
    overflow: "hidden",
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: espacos.lg,
    paddingVertical: espacos.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: cores.borda,
  },
  dropdownItemTexto: {
    fontSize: 14,
    color: cores.textoPrincipal,
  },
  dropdownItemTextoSelecionado: {
    color: cores.primaria,
    fontWeight: "600",
  },
  gridIcones: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacos.sm,
  },
  iconeBotao: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  iconeBotaoSelecionado: {
    backgroundColor: cores.azulEscuro,
    borderColor: cores.azulEscuro,
  },
  gridCores: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacos.sm,
  },
  corBotao: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    width: "47%",
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  corBotaoSelecionada: {
    borderColor: cores.primaria,
    backgroundColor: cores.primariaSuave,
  },
  corBolinha: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  corTexto: {
    fontSize: 12,
    fontWeight: "500",
    color: cores.textoPrincipal,
  },
  erro: {
    fontSize: 13,
    color: cores.vermelho,
  },
  acoes: {
    flexDirection: "row",
    gap: espacos.md,
    paddingTop: espacos.sm,
  },
  botao: {
    flex: 1,
    height: 49,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoCancelar: {
    backgroundColor: cores.card,
    borderWidth: 1,
    borderColor: cores.borda,
  },
  botaoCancelarTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: cores.textoPrincipal,
  },
  botaoCriar: {
    backgroundColor: cores.primaria,
  },
  botaoCriarDesabilitado: {
    opacity: 0.5,
  },
  botaoCriarTexto: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
});
