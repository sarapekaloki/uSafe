import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomePage from './src/screens/HomePage'
import RegisterScreen from './src/screens/RegisterScreen';
import OwnProfileScreen from './src/screens/OwnProfile';
import Settings from './src/screens/Settings';


const Stack = createNativeStackNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Home Page" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} /> 
        <Stack.Screen options={{ headerShown: true }} name="Perfil" component={OwnProfileScreen} />
        <Stack.Screen options={{ headerShown: true }} name="Configuración" component={Settings} />

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
