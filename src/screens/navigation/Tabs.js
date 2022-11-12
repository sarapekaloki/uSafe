import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useState, useEffect } from 'react';
import OwnProfile from "../OwnProfile";
import { Platform, StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import Settings from "../Settings"
import MapScreen from "../MapScreen";
import AlertScreen from "./AlertScreen";
import {collection, getFirestore, onSnapshot, query, where} from "firebase/firestore";
import firebase from "firebase/compat";
import {auth, firebaseConfig} from "../../../firebase";
import DeactivatedMapScreen from "../DeactivatedMapScreen";
import {getCurrentUser} from "../../hooks/getCurrentUser";
import {fetchAllAlarms} from "../../hooks/fetchAllAlarms";
import {fetchAllUsers} from "../../hooks/fetchAllUsers";
import {updateUserLocation} from "../../hooks/updateUserLocation";

const Tab = createBottomTabNavigator()


const Tabs = () => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const [ alertMode , set_alertMode ] = useState(false);
    const [ gotInfo, setGotInfo ] = useState(false);

    const [locationShared,setLocationShared] = useState(false);

    const backgroundColor = !alertMode ? '#fff' : '#28194C'
    const fontColor = !alertMode ? '#000' : '#fff'

    const [currentUser, setCurrentUser] = useState(null);

    const [locationPermission, setLocationPermission] = useState(false);


    useEffect(() => {
        if(!gotInfo || !currentUser){
            getCurrentUser(setCurrentUser).then();
            setGotInfo(true);

        }});

    useEffect(()=>{
    },[currentUser,locationPermission]);

    useEffect(()=>{
        const interval = setInterval(()=>{
            if(currentUser){
                updateUserLocation(currentUser,setLocationPermission).then();
            }
        },6000)
        return () => clearInterval(interval);
    });

    function userIsInZone(){
        if(currentUser){
            return ((currentUser.coordinates.longitude > -116.925793) && (currentUser.coordinates.longitude < -116.922382))
                && currentUser.coordinates.latitude < 32.508180 && currentUser.coordinates.latitude > 32.505300;
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
        <Tab.Screen name="Configuración" component={Settings} options={{
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
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontWeight: 'bold',
            fontSize: 25,
            right: Platform.OS == 'ios'? '225%': 0,
            color: fontColor
          }
        }}
        />

        <Tab.Screen name="Mapa" component={locationPermission && userIsInZone() ? MapScreen : DeactivatedMapScreen} options={{
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