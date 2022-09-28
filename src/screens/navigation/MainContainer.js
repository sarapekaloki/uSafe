import * as React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import AlertScreen from "./AlertScreen";
import SettingsScreen from "./SettingsScreen";
import MapScreen from "./MapScreen";
import ProfileScreen from "./ProfileScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

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
                    let icon;
                    let dark_icon;
                    let rn = route.name

                    if(rn === mapName){
                        icon = !focused ? require('../../../assets/icons/map.png') :
                            require('../../../assets/icons/map_dark.png')
                    } else if (rn === profileName){
                        icon = !focused ? require('../../../assets/icons/profile.png') :
                            require('../../../assets/icons/profile_dark.png')
                    } else if (rn === settingsName){
                        icon = !focused ? require('../../../assets/icons/settings.png') :
                            require('../../../assets/icons/settings_dark.png')
                    } else if (rn === alertName){
                        icon = !focused ? require('../../../assets/icons/alert.png') :
                            require('../../../assets/icons/alert_dark.png')
                    }

                    return <Image source={icon}/>
                },
                tabBarStyle: [
                    {
                        "padding":50,
                        "paddingBottom": 50,
                        "height":70
                    }
                ]

            }
            )}
            >

                <Tab.Screen options={{ headerShown: false }} name={alertName} component={AlertScreen}/>

                <Tab.Screen options={{ headerShown: false }} name={settingsName} component={SettingsScreen}/>
                <Tab.Screen options={{ headerShown: false }} name={profileName} component={ProfileScreen}/>
                <Tab.Screen options={{ headerShown: false }} name={mapName} component={MapScreen}/>




            </Tab.Navigator>
        </NavigationContainer>
    )
}
