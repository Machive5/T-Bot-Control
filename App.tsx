/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from "@react-navigation/native";
import Home from "./src/Home";
import Controller from "./src/Controller";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { configureReanimatedLogger, ReanimatedLogLevel } from "react-native-reanimated";
import './global.css';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const Stack = createNativeStackNavigator();
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
});

const HomeWithGestureHandler = () => {
  return (
    <GestureHandlerRootView>
      <Home />
    </GestureHandlerRootView>
  );
};

const ControllerWithGestureHandler = () => {
  return (
    <GestureHandlerRootView>
      <Controller />
    </GestureHandlerRootView>
  );
};

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeWithGestureHandler} />
        <Stack.Screen name="Controller" component={ControllerWithGestureHandler} />
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
