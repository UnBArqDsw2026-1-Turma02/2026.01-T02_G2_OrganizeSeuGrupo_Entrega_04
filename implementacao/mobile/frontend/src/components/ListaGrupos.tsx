import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { listarGrupos } from "../services/grupoService";
import { Grupo } from "../types/Grupo";
import { cores, espacos } from "../theme/tokens";
import { GrupoCard } from "./GrupoCard";

interface ListaGruposProps {
  onAbrirGrupo?: (grupo: Grupo) => void;
  // Gatilho de recarga: ao mudar de valor, força um novo GET /grupos.
  // Usado para refletir um grupo recém-criado pelo modal "Criar Novo Grupo".
  recarregar?: number;
}

// Listagem de grupos da tela "Meus Grupos" (Figma node 48:1680).
// Consome `GET /grupos` e trata os estados de carregamento, erro e lista vazia.
export function ListaGrupos({ onAbrirGrupo, recarregar }: ListaGruposProps): JSX.Element {
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  // Id da requisição mais recente. Garante que respostas fora de ordem ou que
  // chegam após desmontar/recarregar não sobrescrevam o estado atual.
  const reqAtual = useRef(0);

  // Busca os grupos no backend. `ehRefresh` controla qual indicador exibir
  // (spinner central na carga inicial x pull-to-refresh).
  const carregar = useCallback(async (ehRefresh = false) => {
    const id = ++reqAtual.current;
    ehRefresh ? setAtualizando(true) : setCarregando(true);
    setErro(null);
    try {
      const dados = await listarGrupos();
      if (id !== reqAtual.current) return; // requisição obsoleta — ignora.
      setGrupos(dados);
    } catch (e) {
      if (id !== reqAtual.current) return;
      setErro(e instanceof Error ? e.message : "Erro inesperado ao carregar os grupos.");
    } finally {
      if (id === reqAtual.current) {
        ehRefresh ? setAtualizando(false) : setCarregando(false);
      }
    }
  }, []);

  // Recarrega na montagem e sempre que `recarregar` mudar (ex.: novo grupo criado).
  // A limpeza invalida qualquer requisição em voo ao desmontar ou re-disparar.
  useEffect(() => {
    carregar();
    return () => {
      reqAtual.current++;
    };
  }, [carregar, recarregar]);

  // Estado: carregando (carga inicial).
  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={cores.primaria} />
        <Text style={styles.textoCentro}>Carregando grupos...</Text>
      </View>
    );
  }

  // Estado: erro (com ação de tentar novamente).
  if (erro) {
    return (
      <View style={styles.centro}>
        <MaterialCommunityIcons
          name="wifi-off"
          size={48}
          color={cores.textoSuave}
        />
        <Text style={styles.tituloErro}>Algo deu errado</Text>
        <Text style={styles.textoCentro}>{erro}</Text>
        <Pressable
          style={styles.botaoTentar}
          onPress={() => carregar()}
          accessibilityRole="button"
        >
          <Text style={styles.botaoTentarTexto}>Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  // Estado: sucesso (lista com pull-to-refresh e estado vazio).
  return (
    <FlatList
      data={grupos}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <GrupoCard grupo={item} onAbrir={onAbrirGrupo} />}
      contentContainerStyle={styles.lista}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={atualizando}
          onRefresh={() => carregar(true)}
          colors={[cores.primaria]}
          tintColor={cores.primaria}
        />
      }
      ListEmptyComponent={
        <View style={styles.centro}>
          <MaterialCommunityIcons
            name="account-group-outline"
            size={48}
            color={cores.textoSuave}
          />
          <Text style={styles.tituloErro}>Nenhum grupo ainda</Text>
          <Text style={styles.textoCentro}>
            Crie seu primeiro grupo de estudos para começar.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  lista: {
    padding: espacos.lg,
    flexGrow: 1,
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: espacos.xl,
    gap: espacos.sm,
  },
  textoCentro: {
    fontSize: 14,
    color: cores.textoSecundario,
    textAlign: "center",
  },
  tituloErro: {
    fontSize: 16,
    fontWeight: "700",
    color: cores.textoPrincipal,
    marginTop: espacos.sm,
  },
  botaoTentar: {
    marginTop: espacos.md,
    backgroundColor: cores.primaria,
    paddingHorizontal: espacos.xl,
    paddingVertical: espacos.md,
    borderRadius: 999,
  },
  botaoTentarTexto: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
  },
});
