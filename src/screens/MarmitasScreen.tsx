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
export default function MarmitasScreen() {
  const [preferencias, setPreferencias] = useState("");
  const [dias, setDias] = useState("5");
  const [load, setLoad] = useState(false);
  const [plano, setPlano] = useState("");

 

  async function gerarPlano() {
    if (!dias) {
      Alert.alert("Atenção", "Informe o número de dias.");
      return;
    }
    setLoad(true);
    setPlano("");
    Keyboard.dismiss();

    const prompt = `
Monte um plano de marmitas para ${dias} dias (segunda a sexta, se for 5), com base nas preferências: ${
      preferencias || "livre"
    }.
Formatação por dia:
- Nome do prato
- Macros aproximadas (opcional)
- Lista de ingredientes
- Modo de preparo (resumo)
- Dica de armazenamento
- Não use negritos 

Se possível, inclua 1 link do YouTube com preparo similar no final do plano.
`;

    try {
      const t = await askGemini(prompt);
      setPlano(t);
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Não consegui gerar o plano agora.");
    } finally {
      setLoad(false);
    }
  }

  return (
    <View style={S.container}>
      <Text style={S.header}>Marmitas da Semana</Text>

      <View style={S.form}>
        <TextInput
          placeholder="Preferências (ex.: frango, low carb, vegetariano)"
          style={S.input}
          value={preferencias}
          onChangeText={setPreferencias}
        />
        <TextInput
          placeholder="Número de dias (ex.: 5)"
          keyboardType="numeric"
          style={S.input}
          value={dias}
          onChangeText={setDias}
        />
      </View>

      <TouchableOpacity style={S.button} onPress={gerarPlano}>
        <Text style={S.buttonText}>Gerar plano</Text>
        <MaterialCommunityIcons name="calendar" size={22} color="#FFF" />
      </TouchableOpacity>

      <ScrollView style={S.scroll}>
        {load && <ActivityIndicator size="large" style={{ marginTop: 16 }} />}
        {!!plano && (
          <View style={S.content}>
            <Text style={{ lineHeight: 22 }}>{plano}</Text>
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#94a3b8",
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#00DB2A",
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
