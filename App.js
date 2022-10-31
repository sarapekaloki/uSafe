import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomePage from './src/screens/HomePage'
import RegisterScreen from './src/screens/RegisterScreen';
import SettingsScreen from './src/screens/navigation/SettingsScreen'
import ProfileScreen from './src/screens/navigation/ProfileScreen'
import MapScreen from './src/screens/navigation/MapScreen'
import AlertScreen from './src/screens/navigation/AlertScreen'
import MainContainer from './src/screens/navigation/MainContainer'
import HomeScreen from "./src/screens/HomeScreen";
import OwnProfileScreen from './src/screens/OwnProfile';
import Settings from './src/screens/Settings';
import {useState} from "react";



const Stack = createNativeStackNavigator();
global.alerta = false;
export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Home Page" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Map Screen" component={MapScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Home Screen" component={HomeScreen} />
        <Stack.Screen options={{ headerShown: true }} name="Perfil" component={OwnProfileScreen} />
        <Stack.Screen options={{ headerShown: true}} name="Configuración" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
