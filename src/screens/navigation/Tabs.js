import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from 'react';
import OwnProfile from "../OwnProfile";
import { Platform, StyleSheet, Image } from "react-native";
import Settings from "../Settings"
import MapScreen from "../MapScreen";
import AlertScreen from "./AlertScreen";
import {collection, getFirestore, onSnapshot, query, where} from "firebase/firestore";
import firebase from "firebase/compat";
import {auth, firebaseConfig} from "../../../firebase";
import OutOfRangeScreen from "../OutOfRangeScreen";
import {getCurrentUser} from "../../hooks/getCurrentUser";
import {updateUserLocation} from "../../hooks/updateUserLocation";
import {
    useFonts,
    Spartan_600SemiBold
  } from '@expo-google-fonts/spartan';
const Tab = createBottomTabNavigator()


const Tabs = () => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const [ alertMode , set_alertMode ] = useState(false);
    const [ gotInfo, setGotInfo ] = useState(false);

    const backgroundColor = !alertMode ? '#fff' : '#28194C'
    const fontColor = !alertMode ? '#000' : '#fff'

    const [currentUser, setCurrentUser] = useState(null);
   
    useFonts({
        Spartan_600SemiBold,
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

    return (
        <Tab.Navigator initialRouteName="Mapa" screenOptions={{tabBarShowLabel: false,tabBarStyle:{
            elevation: 0,
            backgroundColor: backgroundColor,
            height: '11%',
            position: 'absolute',
            ...styles.shadow
        }
            }}>
        <Tab.Screen name="Alarma"  component={AlertScreen}  listeners={({ navigation }) => ({
            tabPress: (e) => {
                e.preventDefault()
                navigation.navigate("AlertScreen")
            },
        })} options={{
            tabBarIcon: ({focused}) => (
                <Image source={focused? require( '../../../assets/icons/selected-alarm-icon.png') : require( '../../../assets/icons/unselected-alarm-icon.png') } 
                        style={styles.alarm}/>

            )
        }}/>
        <Tab.Screen name="Configuración" component={OwnProfile} options={{
            tabBarIcon: ({ focused }) => (
                <Image 
                    source={focused ? (alertMode ? require( `../../../assets/icons/dark-settings-selected.png`) :  require( `../../../assets/icons/light-settings-selected.png`) ): alertMode ? require( `../../../assets/icons/dark-settings-unselected.png`) : require( `../../../assets/icons/light-settings-unselected.png`) }
                    style={styles.icons}
                    />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontWeight: 'bold',
            fontSize: 25,
            right: Platform.OS == 'ios'? '55%': 0,
            color: fontColor
          }
        }}
        />
        <Tab.Screen name="Perfil" component={OwnProfile} options={{
            tabBarIcon: ({ focused }) => (
                <Image 
                    source={focused? (alertMode ? require( `../../../assets/icons/dark-profile-selected.png`): require( `../../../assets/icons/light-profile-selected.png`)) : (alertMode ? require( `../../../assets/icons/dark-profile-unselected.png`) : require( `../../../assets/icons/light-profile-unselected.png`)) }
                    style={styles.icons}
                    />
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

        <Tab.Screen name="Mapa" component={userIsInZone() ? MapScreen : OutOfRangeScreen} options={{
            tabBarIcon: ({ focused }) => (
                <Image 
                    source={focused? (alertMode ? require( `../../../assets/icons/dark-map-selected.png`) : require( `../../../assets/icons/light-map-selected.png`)):(alertMode ? require( `../../../assets/icons/dark-map-unselected.png`) :  require( `../../../assets/icons/light-map-unselected.png`))}
                    style={styles.icons}
                    />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontWeight: 'bold',
            fontSize: 25,
            right: Platform.OS == 'ios'? '210%': 0,
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
       width: 90,
       height: 90,
       bottom: 10,
       left: 10,
       borderRadius: 50,
    }
})