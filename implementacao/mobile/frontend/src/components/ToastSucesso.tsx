import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text } from "react-native";
import { cores, espacos } from "../theme/tokens";

interface ToastSucessoProps {
  // Mensagem exibida (ex.: "Grupo criado com sucesso!").
  mensagem: string;
  // Controla a exibição. Quando false, o toast some.
  visivel: boolean;
}

// Toast de sucesso exibido no topo da tela "Meus Grupos" após o POST /grupos
// retornar 201 (Figma node 191:1162). Faz fade-in/out conforme `visivel`.
export function ToastSucesso({ mensagem, visivel }: ToastSucessoProps): JSX.Element | null {
  const opacidade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacidade, {
      toValue: visivel ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [visivel, opacidade]);

  // Mantém fora da árvore quando escondido para não capturar toques.
  if (!visivel) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.toast, { opacity: opacidade }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <MaterialCommunityIcons
        name="check-circle"
        size={20}
        color={cores.sucessoTexto}
      />
      <Text style={styles.texto}>{mensagem}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacos.sm,
    backgroundColor: cores.sucessoFundo,
    borderColor: cores.sucessoBorda,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: espacos.md,
    paddingVertical: espacos.md,
    marginHorizontal: espacos.lg,
    marginBottom: espacos.sm,
    // sombra sutil (iOS) + elevação (Android)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  texto: {
    color: cores.sucessoTexto,
    fontSize: 13,
    fontWeight: "600",
  },
});
