import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import AlertScreen from "./AlertScreen";
import SettingsScreen from "./SettingsScreen";
import MapScreen from "./MapScreen";
import ProfileScreen from "./ProfileScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons"

const alertName = 'Alert';
const settingsName = 'Settings';
const mapName = 'Map';
const profileName = 'Profile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MainContainer(){
    return(
        <NavigationContainer independent={true}>
            <Tab.Navigator
            initialRouteName={mapName}
            screenOptions={({route}) => ({
                tabBarIcon: ({focused,color,size}) => {
                    let iconName;
                    let rn = route.name;

                    if(rn === mapName){
                        iconName = focused ? "globe-outline" : "globe"
                    } else if (rn === profileName){
                        iconName = focused ? "person-circle-outline" : "person-circle"
                    } else if (rn === settingsName){
                        iconName = focused ? "settings-outline" : "settings"
                    } else if (rn === alertName){
                        iconName = focused ? "warning-outline" : "warning"
                    }
                    return <Ionicons name={iconName} size={40} color={color}/>
                },
                tabBarActiveTintColor: '#28194C',
                tabBarInactiveTintColor: '#D4B2EF',
                tabBarShowLabel: false,
                tabBarStyle: {height:70},
            })}
            >

                <Tab.Screen options={{ headerShown: false }} name={alertName} component={AlertScreen}/>
                <Tab.Screen options={{ headerShown: false }} name={settingsName} component={SettingsScreen}/>
                <Tab.Screen options={{ headerShown: false }} name={profileName} component={ProfileScreen}/>
                <Tab.Screen options={{ headerShown: false }} name={mapName} component={MapScreen}/>




            </Tab.Navigator>
        </NavigationContainer>
    )
}
