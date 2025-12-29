/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from "@react-navigation/native";
import { View, Text } from "react-native";
import "./global.css";
import Home from "./src/Home";
import Controller from "./src/Controller";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";

const Stack = createNativeStackNavigator();
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Controller" component={Controller} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// function App() {
//   return (
//     <View className="flex-1 items-center justify-center bg-white">
//       <Text className="text-xl font-bold text-blue-500">
//         Welcome to Nativewind!
//       </Text>
//     </View>
//   );
// }

export default App;
