import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CriarGrupoModal } from "./src/components/CriarGrupoModal";
import { ListaGrupos } from "./src/components/ListaGrupos";
import { ToastSucesso } from "./src/components/ToastSucesso";
import { cores, espacos } from "./src/theme/tokens";

// Tempo (ms) que o toast de sucesso permanece visível antes de sumir.
const DURACAO_TOAST = 3000;

// Entrypoint do app. Exibe a tela "Meus Grupos" com a listagem de grupos, o
// botão "+" que abre o modal "Criar Novo Grupo" e o toast de sucesso pós-criação.
export default function App(): JSX.Element {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [sucessoVisivel, setSucessoVisivel] = useState(false);
  // Incrementa a cada criação para forçar a lista a recarregar (GET /grupos).
  const [chaveRecarga, setChaveRecarga] = useState(0);
  const timerToast = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpa o timer do toast ao desmontar.
  useEffect(() => {
    return () => {
      if (timerToast.current) {
        clearTimeout(timerToast.current);
      }
    };
  }, []);

  // Após o POST retornar 201: fecha o modal, recarrega a lista (para exibir o
  // novo grupo) e mostra o toast de sucesso por alguns segundos.
  const handleGrupoCriado = useCallback(() => {
    setModalVisivel(false);
    setChaveRecarga((chave) => chave + 1);
    setSucessoVisivel(true);
    if (timerToast.current) {
      clearTimeout(timerToast.current);
    }
    timerToast.current = setTimeout(() => setSucessoVisivel(false), DURACAO_TOAST);
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.tela}>
        <StatusBar style="dark" />

        <View style={styles.cabecalho}>
          <Text style={styles.titulo}>Meus Grupos</Text>
          <Pressable
            style={styles.botaoNovo}
            onPress={() => setModalVisivel(true)}
            accessibilityRole="button"
            accessibilityLabel="Criar novo grupo"
          >
            <MaterialCommunityIcons name="plus" size={22} color={cores.fundo} />
          </Pressable>
        </View>

        <ToastSucesso mensagem="Grupo criado com sucesso!" visivel={sucessoVisivel} />

        <ListaGrupos recarregar={chaveRecarga} />

        <CriarGrupoModal
          visivel={modalVisivel}
          onFechar={() => setModalVisivel(false)}
          onCriado={handleGrupoCriado}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: cores.fundo,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: espacos.lg,
    paddingTop: espacos.lg,
    paddingBottom: espacos.sm,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: cores.textoPrincipal,
  },
  botaoNovo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: cores.azulEscuro,
    // sombra sutil (iOS) + elevação (Android)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 7.5,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
});
