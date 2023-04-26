import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from 'react';
import OwnProfile from "../OwnProfile";
import Notifications from "../Notifications";
import Messages from "../Messages";
import { Platform, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons'; 
import MapScreen from "../MapScreen";
import AlertScreen from "./AlertScreen";
import {collection, getFirestore, onSnapshot, query, where} from "firebase/firestore";
import firebase from "firebase/compat";
import {auth, firebaseConfig} from "../../../firebase";
import OutOfRangeScreen from "../OutOfRangeScreen";
import {getCurrentUser} from "../../hooks/getCurrentUser";
import {
    useFonts,
    Spartan_700Bold,
    Spartan_600SemiBold
  } from '@expo-google-fonts/spartan';
const Tab = createBottomTabNavigator()


const Tabs = () => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const [ alertMode , set_alertMode ] = useState(false);
    const [ gotInfo, setGotInfo ] = useState(false);

    const backgroundColor = !alertMode ? '#fff' : '#000'
    const fontColor = !alertMode ? '#000' : '#fff'

    const [currentUser, setCurrentUser] = useState(null);

    let [fontsLoaded] = useFonts({
        Spartan_700Bold,
        Spartan_600SemiBold
    });

    useEffect(() => {
        if(!gotInfo || !currentUser){
            getCurrentUser(setCurrentUser).then();
            const q = query(collection(db, "alarms"), where("alarmingUser", "==", auth.currentUser.email))
            onSnapshot(q,  (querySnapshot) => {
                let alertModeActive = false
                querySnapshot.forEach((doc) => {
                    if(doc.data().alarmingUser === auth.currentUser.email){
                        alertModeActive = true
                    }
                });
                set_alertMode(alertModeActive)
            } )
            setGotInfo(true);
        }});

    useEffect( () => {}, [alertMode,currentUser]);


    useEffect(()=>{
        const interval = setInterval(()=>{
            if(currentUser){
                // updateUserLocation(currentUser).then();
            }
        },6000)
        return () => clearInterval(interval);
    });

    function userIsInZone(){
        if(currentUser){
            return ((currentUser.coordinates.longitude > -116.925975) && (currentUser.coordinates.longitude < -116.922080))
                && currentUser.coordinates.latitude < 32.508246 && currentUser.coordinates.latitude > 32.505197;
        }
        return false;

    }

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Tab.Navigator initialRouteName="Mapa" screenOptions={{tabBarShowLabel: false,tabBarStyle:{
            elevation: 0,
            backgroundColor: backgroundColor,
            height: '11%',
            position: 'absolute',
            ...styles.shadow
        }
            }}>

        <Tab.Screen name="Mapa" component={MapScreen} options={{
            tabBarIcon: ({ focused }) => (
                <Feather name="map-pin" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")}ffr443 />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontFamily: 'Spartan_700Bold',
            fontSize: 20,
            right: Platform.OS == 'ios'? '215%': 0,
            color: fontColor
          }
        }}
        />
        <Tab.Screen name="Notificaciones" component={Notifications} options={{
            tabBarIcon: ({ focused }) => (
                <Feather name="bell" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")} />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontFamily: 'Spartan_700Bold',
            fontSize: 20,
            right: Platform.OS == 'ios'? '65%': 0,
            color: fontColor
          }
        }}
        />
        <Tab.Screen name="Alarma"  component={AlertScreen}  listeners={({ navigation }) => ({
            tabPress: (e) => {
                e.preventDefault()
                navigation.navigate("AlertScreen")
            },
        })} options={{
            tabBarIcon: ({focused}) => (
                // <Feather name="alert-circle" size={24} color="black" style ={styles.alarm}/>
                <Image source={require( '../../../assets/icons/selected-alarm-icon.png') } 
                    style={styles.alarm}/>
             

            )
        }}/>
      
        <Tab.Screen name="Perfil" component={OwnProfile} options={{
            tabBarIcon: ({ focused }) => (
                <Feather name="user" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")} />
               
          ),
          headerStyle:{
            backgroundColor: '#4C11CB',
            shadowColor: 'transparent', 
            elevation: 0,
          },
          headerTitleStyle:{
            fontFamily: 'Spartan_600SemiBold',
            fontSize: 22,
            color: '#FFFFFF'
          }
        }}
        />
          <Tab.Screen name="Mensajes" component={Messages} options={{
            tabBarIcon: ({ focused }) => (
                <Feather name="message-square" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")} />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontFamily: 'Spartan_700Bold',
            fontSize: 20,
            right: Platform.OS == 'ios'? '120%': 0,
            color: fontColor
          }
        }}
        />
        </Tab.Navigator>
    );
}
export default Tabs;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#b0b0b0',
        shadowOffset: {
            width: 0,
            height: -3,
          },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
    icons: {
        width: 25,
        height: 25
    },
    alarm: {
       width: 70,
       height: 70,
       borderRadius: 50,
    }
})