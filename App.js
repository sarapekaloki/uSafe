import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomePage from './src/screens/HomePage'
import RegisterScreen from './src/screens/RegisterScreen';
import DeleteAccount from './src/screens/DeleteAccount';
import UpdatePassword from './src/screens/UpdatePassword';
import UpdateUsername from './src/screens/UpdateUsername';
import UpdateProfilePicture from './src/screens/UpdateProfilePicture';
import Tabs from './src/screens/navigation/Tabs';


const Stack = createNativeStackNavigator();
global.alerta = false;
export default function App(){
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Home Page" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} /> 
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
       <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Delete Account" component={DeleteAccount} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Update Password" component={UpdatePassword} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Update Username" component={UpdateUsername} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Update Profile Picture" component={UpdateProfilePicture} />
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
