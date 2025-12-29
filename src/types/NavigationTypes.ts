import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type rootStackParamList = {
  Home: undefined;
  Controller: undefined;
};

export type NavigationProp = NativeStackNavigationProp<rootStackParamList>;
