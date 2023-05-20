import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {useState, useEffect, useRef} from 'react';
import OwnProfile from "../OwnProfile";
import Notifications from "../Notifications";
import { updateUserLocation } from "../../hooks/updateUserLocation";
import Messages from "../Messages";
import { useRoute } from "@react-navigation/native";

import {StyleSheet, Image, Animated} from "react-native";
import { Feather } from '@expo/vector-icons'; 
import MapScreen from "../MapScreen";
import AlertScreen from "./AlertScreen";
import {collection, getFirestore, onSnapshot, query, where, doc} from "firebase/firestore";
import firebase from "firebase/compat";
import { tabsWords } from "../../lenguagesDicts/tabsWords";
import {auth, firebaseConfig} from "../../../firebase";
import {getCurrentUser} from "../../hooks/getCurrentUser";
import {
    useFonts,
    Spartan_700Bold,
    Spartan_600SemiBold
  } from '@expo-google-fonts/spartan';
const Tab = createBottomTabNavigator()


const Tabs = () => {
    firebase.initializeApp(firebaseConfig);
    const currentEmail = auth.currentUser.email;
    const db = getFirestore();
    const route = useRoute();
    const len = route.params.len;
    const [gotNotifications, setGotNotifications] = useState(false);
    const [notifications, setNotifications] = useState(null);
    const [ alertMode , set_alertMode ] = useState(false);
    const [ gotInfo, setGotInfo ] = useState(false);

    const backgroundColor = !alertMode ? '#fff' : '#000'
    const fontColor = !alertMode ? '#000' : '#fff'

    const [currentUser, setCurrentUser] = useState(null);

    let [fontsLoaded] = useFonts({
        Spartan_700Bold,
        Spartan_600SemiBold

    });

    const [tabBarVisible, setTabBarVisible] = useState(true);

    const fadeAnim = useRef(new Animated.Value(0)).current;
   
    useFonts({
        Spartan_600SemiBold,
    });

    useEffect(()=>{
        Animated.timing(fadeAnim, {
            toValue: tabBarVisible ? 1 : 0,
            duration: 10000,
            useNativeDriver: true,
        }).start();
    },[tabBarVisible]);

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
                updateUserLocation(currentUser).then();
            }
        },6000)
        return () => clearInterval(interval);
    });

    useEffect(() => {
        onSnapshot(doc(db, "notifications", currentEmail.toLowerCase()), (doc) => {
            if(doc.data()=== undefined) return;
            setNotifications(doc.data());            
            });    
    },[])

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Tab.Navigator initialRouteName={tabsWords[len].map} screenOptions={{tabBarShowLabel: false,tabBarStyle:{
            elevation: 0,
            backgroundColor: backgroundColor,
            height: tabBarVisible ? '11%' : 0,
            position: 'absolute',
            ...styles.shadow
        }
            }}>
            <Tab.Screen name={tabsWords[len].map} children={
                ()=> <MapScreen setVisible={setTabBarVisible} visible={tabBarVisible}/>
            }
                options={{
                tabBarIcon: ({ focused }) => (
                    <Feather name="map-pin" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")}/>
               
                ),
                headerStyle:{
                    backgroundColor: backgroundColor,
                },
                headerTitleStyle:{
                    fontFamily: 'Spartan_700Bold',
                    fontSize: 20,
                    color: fontColor
                }
            }}
            />
        <Tab.Screen name={tabsWords[len].notifications} children={() => <Notifications notifications={notifications.notifications}/>} options={{
            tabBarIcon: ({ focused }) => (
                tabBarVisible && <Feather name="bell" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")} />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontFamily: 'Spartan_700Bold',
            fontSize: 20,
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
                tabBarVisible && <Image source={require( '../../../assets/icons/selected-alarm-icon.png') }
                    style={styles.alarm}/>


            )
        }}/>

        <Tab.Screen name={tabsWords[len].profile} component={OwnProfile} options={{
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
          <Tab.Screen name={tabsWords[len].chats} component={Messages} options={{
            tabBarIcon: ({ focused }) => (
                <Feather name="message-square" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")} />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontFamily: 'Spartan_700Bold',
            fontSize: 20,
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