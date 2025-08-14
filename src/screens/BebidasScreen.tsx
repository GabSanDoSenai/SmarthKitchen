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
import { askGemini, extractTitle } from "../ai";

const alturaStatusBar = StatusBar.currentHeight;

export default function BebidasScreen() {
  const [fruta1, setFruta1] = useState("");
  const [fruta2, setFruta2] = useState("");
  const [liquido, setLiquido] = useState("");
  const [ocasiao, setOcasiao] = useState("");
  const [load, setLoad] = useState(false);
  const [texto, setTexto] = useState("");
  const [titulo, setTitulo] = useState("");

  async function gerar() {
    if (!fruta1 || !liquido || !ocasiao) {
      Alert.alert("Atenção", "Preencha ao menos fruta 1, líquido e ocasião.");
      return;
    }
    setLoad(true);
    setTexto("");
    setTitulo("");
    Keyboard.dismiss();

    const prompt = `
Gere uma receita de bebida/smoothie para **${ocasiao}** usando:
- Frutas: ${fruta1}${fruta2 ? ", " + fruta2 : ""}
- Líquido base: ${liquido}

Formatação:
# <TÍTULO DA BEBIDA>
Tempo de preparo, rendimento, ingredientes (lista), modo de preparo (passos).
Inclua 1 dica de variação e, se possível, 1 link do YouTube no final.
- Não use negritos 
`;

    try {
      const t = await askGemini(prompt);
      setTexto(t);
      setTitulo(extractTitle(t));
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não consegui gerar a bebida agora.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={S.container}>
      <Text style={S.header}>Bebidas & Smoothies</Text>

      <View style={S.form}>
        <Text style={S.label}>Ingredientes da bebida:</Text>
        <TextInput
          placeholder="Fruta 1 (obrigatório)"
          style={S.input}
          value={fruta1}
          onChangeText={setFruta1}
        />
        <TextInput
          placeholder="Fruta 2 (opcional)"
          style={S.input}
          value={fruta2}
          onChangeText={setFruta2}
        />
        <TextInput
          placeholder="Líquido base (ex.: leite, água, água de coco)"
          style={S.input}
          value={liquido}
          onChangeText={setLiquido}
        />
        <TextInput
          placeholder="Ocasião (ex.: café da manhã, pós-treino)"
          style={S.input}
          value={ocasiao}
          onChangeText={setOcasiao}
        />
      </View>

      <TouchableOpacity style={S.button} onPress={gerar}>
        <Text style={S.buttonText}>Gerar bebida</Text>
        <MaterialCommunityIcons name="cup" size={22} color="#FFF" />
      </TouchableOpacity>

      <ScrollView style={S.scroll}>
        {load && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}
        {!!texto && (
          <View style={S.content}>
            {!!titulo && <Text style={S.title}>{titulo}</Text>}
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
  header: { fontSize: 28, fontWeight: "bold", paddingTop: Platform.OS === "android" ? alturaStatusBar : 48, },
  form: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  label: { fontWeight: "bold", fontSize: 16, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#FC5891",
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
});
