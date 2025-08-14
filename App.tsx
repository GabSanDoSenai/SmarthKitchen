import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeReceitaScreen from "./src/screens/HomeReceitaScreen";
import BebidasScreen from "./src/screens/BebidasScreen";
import MarmitasScreen from "./src/screens/MarmitasScreen";
import SubstituicoesScreen from "./src/screens/SubstituicoesScreen";
import { StatusBar } from "react-native";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "blue",
          tabBarIcon: ({ color, size }) => {
            const map: Record<string, any> = {
              Receitas: "food-variant",
              Bebidas: "cup",
              Marmitas: "calendar",
              Substituições: "swap-horizontal",
            };
            const name = map[route.name] ?? "silverware-fork-knife";
            return (
              <MaterialCommunityIcons name={name} size={size} color={color} />
            );
          },
        })}
      >
        <Tab.Screen name="Receitas" component={HomeReceitaScreen} />
        <Tab.Screen name="Bebidas" component={BebidasScreen} />
        <Tab.Screen name="Marmitas" component={MarmitasScreen} />
        <Tab.Screen name="Substituições" component={SubstituicoesScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
