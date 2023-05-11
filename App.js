import { StyleSheet } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import LoginScreen from './src/screens/LoginScreen';
import Settings from './src/screens/Settings';
import HomePage from './src/screens/HomePage'
import RegisterScreen from './src/screens/RegisterScreen';
import DeleteAccount from './src/screens/DeleteAccount';
import UpdatePassword from './src/screens/UpdatePassword';
import UpdateUsername from './src/screens/UpdateUsername';
import UpdateProfilePicture from './src/screens/UpdateProfilePicture';
import Tabs from './src/screens/navigation/Tabs';
import AlertScreen from "./src/screens/navigation/AlertScreen";
import Main from './src/screens/firstTimeSetUp/main';
import HelpRadarSetUp from './src/screens/firstTimeSetUp/helpRadar';
import LenguageSelection from './src/screens/firstTimeSetUp/lenguageSelection';
import WhoHelpedYou from "./src/screens/WhoHelpedYou";
const Stack = createNativeStackNavigator();
global.alerta = false;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App(){
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
     // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });
    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
  
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen options={{ headerShown: false }} name="Home Page" component={HomePage} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown: false,  gestureEnabled: false }} name="MainFirstTimeSetUp" component={Main} />
        <Stack.Screen options={{ headerShown: false,  gestureEnabled: false  }}  name="LenguageSelection" component={LenguageSelection} />
        <Stack.Screen options={{ headerShown: false,  gestureEnabled: false  }}  name="HelpRadarSetUp" component={HelpRadarSetUp} />
        <Stack.Screen options={{ headerShown: false, presentation:'modal' }} name="AlertScreen" component={AlertScreen} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Settings" component={Settings} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="WhoHelpedYou" component={WhoHelpedYou} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Delete Account" component={DeleteAccount} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Update Password" component={UpdatePassword} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Update Username" component={UpdateUsername} />
        <Stack.Screen options={{ headerShown: false, disableBackButtonOverride: true}} name="Update Profile Picture" component={UpdateProfilePicture} />
        <Stack.Screen
              name="Tabs"
              component={Tabs}
              options={{ headerShown: false }}
        />
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
