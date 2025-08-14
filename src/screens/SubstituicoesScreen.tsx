import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    Keyboard,
    Platform,
    StatusBar,
    StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { askGemini } from "../ai";

const alturaStatusBar = StatusBar.currentHeight;
export default function SubstituicoesScreen() {
  const [ingrediente, setIngrediente] = useState("");
  const [restricao, setRestricao] = useState(""); // ex.: vegano, sem lactose, sem glúten
  const [contexto, setContexto] = useState(""); // ex.: bolo doce, molho salgado
  const [load, setLoad] = useState(false);
  const [texto, setTexto] = useState("");

  async function gerar() {
    if (!ingrediente) {
      Alert.alert("Atenção", "Informe o ingrediente a substituir.");
      return;
    }
    setLoad(true);
    setTexto("");
    Keyboard.dismiss();

    const prompt = `
Sugira substituições para o ingrediente: "${ingrediente}".
Contexto do preparo: ${contexto || "geral"}.
Restrição/dieta: ${restricao || "nenhuma"}.

Formatação:
- Múltiplas opções de substituição com proporções (ex.: 1 xícara -> 3/4 xícara de ...)
- Observações de sabor/ textura
- Dicas de uso e possíveis ajustes de receita
- Não use negritos 
`;

    try {
      const t = await askGemini(prompt);
      setTexto(t);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não consegui gerar sugestões agora.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={S.container}>
      <Text style={S.header}>Substituições Inteligentes</Text>

      <View style={S.form}>
        <TextInput
          placeholder="Ingrediente a substituir (ex.: ovo)"
          style={S.input}
          value={ingrediente}
          onChangeText={setIngrediente}
        />
        <TextInput
          placeholder="Restrição (ex.: vegano, sem lactose)"
          style={S.input}
          value={restricao}
          onChangeText={setRestricao}
        />
        <TextInput
          placeholder="Contexto (ex.: bolo, panqueca, molho)"
          style={S.input}
          value={contexto}
          onChangeText={setContexto}
        />
      </View>

      <TouchableOpacity style={S.button} onPress={gerar}>
        <Text style={S.buttonText}>Gerar substituições</Text>
        <MaterialCommunityIcons name="swap-horizontal" size={22} color="#FFF" />
      </TouchableOpacity>

      <ScrollView style={S.scroll}>
        {load && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}
        {!!texto && (
          <View style={S.content}>
            <Text style={{ lineHeight: 22 }}>{texto}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const S = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    paddingTop: 20,
  },
  header: { fontSize: 28, fontWeight: "bold", paddingTop: Platform.OS === "android" ? alturaStatusBar : 48,},
  form: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#514FFF",
    width: "90%",
    borderRadius: 8,
    flexDirection: "row",
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  buttonText: { color: "#FFF", fontWeight: "bold" },
  scroll: { width: "90%", marginTop: 12 },
  content: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
});
