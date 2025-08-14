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

export default function HomeReceitaScreen() {
  const [load, setLoad] = useState(false);
  const [receita, setReceita] = useState("");
  const [titulo, setTitulo] = useState("");

  const [ingr1, setIngr1] = useState("");
  const [ingr2, setIngr2] = useState("");
  const [ingr3, setIngr3] = useState("");
  const [ingr4, setIngr4] = useState("");
  const [ocasiao, setOcasiao] = useState("");

  async function gerarReceita() {
    if (!ingr1 || !ingr2 || !ingr3 || !ingr4 || !ocasiao) {
      Alert.alert("Atenção", "Informe todos os ingredientes e a ocasião!", [
        { text: "Beleza!" },
      ]);
      return;
    }

    setReceita("");
    setTitulo("");
    setLoad(true);
    Keyboard.dismiss();

    const prompt = `
Crie uma receita detalhada para **${ocasiao}** usando: ${ingr1}, ${ingr2}, ${ingr3}, ${ingr4}.
Formatação:
- Primeira linha: "# <TÍTULO DA RECEITA>"
- Depois: tempo de preparo, porções, ingredientes em lista e modo de preparo em passos.
- Se possível, inclua 1 link do YouTube relacionado no final.
- Não use negritos 

Exemplo de cabeçalho:
# Lasanha Cremosa de Frango
`;

    try {
      const texto = await askGemini(prompt);
      setReceita(texto);
      setTitulo(extractTitle(texto));
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não consegui gerar a receita agora.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={ESTILOS.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="#F1F1F1"
      />
      <Text style={ESTILOS.header}>Cozinha fácil</Text>

      <View style={ESTILOS.form}>
        <Text style={ESTILOS.label}>Insira os ingredientes abaixo:</Text>
        <TextInput
          placeholder="Ingrediente 1"
          style={ESTILOS.input}
          value={ingr1}
          onChangeText={setIngr1}
        />
        <TextInput
          placeholder="Ingrediente 2"
          style={ESTILOS.input}
          value={ingr2}
          onChangeText={setIngr2}
        />
        <TextInput
          placeholder="Ingrediente 3"
          style={ESTILOS.input}
          value={ingr3}
          onChangeText={setIngr3}
        />
        <TextInput
          placeholder="Ingrediente 4"
          style={ESTILOS.input}
          value={ingr4}
          onChangeText={setIngr4}
        />
        <TextInput
          placeholder="Almoço ou Jantar"
          style={ESTILOS.input}
          value={ocasiao}
          onChangeText={setOcasiao}
        />
      </View>

      <TouchableOpacity style={ESTILOS.button} onPress={gerarReceita}>
        <Text style={ESTILOS.buttonText}>Gerar receita</Text>
        <MaterialCommunityIcons name="food-variant" size={24} color="#FFF" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        style={ESTILOS.containerScroll}
        showsVerticalScrollIndicator={false}
      >
        {load && (
          <View style={ESTILOS.content}>
            <Text style={ESTILOS.title}>Produzindo receita...</Text>
            <ActivityIndicator size="large" />
          </View>
        )}

        {!!receita && (
          <View style={ESTILOS.content}>
            {!!titulo && (
              <Text style={[ESTILOS.title, { marginBottom: 10 }]}>
                {titulo}
              </Text>
            )}
            <Text style={{ lineHeight: 24 }}>{receita}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const ESTILOS = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
    alignItems: "center",
    paddingTop: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    paddingTop: Platform.OS === "android" ? alturaStatusBar : 48,
  },
  form: {
    backgroundColor: "#FFF",
    width: "90%",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  label: { fontWeight: "bold", fontSize: 18, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    borderColor: "#94a3b8",
    padding: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#FF774B",
    width: "90%",
    borderRadius: 8,
    flexDirection: "row",
    padding: 14,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  buttonText: { fontSize: 18, color: "#FFF", fontWeight: "bold" },
  content: {
    backgroundColor: "#FFF",
    padding: 16,
    width: "100%",
    marginTop: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 14,
  },
  containerScroll: { width: "90%", marginTop: 8 },
});