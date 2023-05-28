import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {useState, useEffect, useRef} from 'react';
import OwnProfile from "../OwnProfile";
import Notifications from "../Notifications";
import { updateUserLocation } from "../../hooks/updateUserLocation";
import Messages from "../Messages";
import { useRoute, useNavigation } from "@react-navigation/native";

import {StyleSheet, Image, Animated, Platform, TouchableOpacity, View, Text} from "react-native";
import { Feather } from '@expo/vector-icons'; 
import MapScreen from "../MapScreen";
import AlertScreen from "./AlertScreen";
import {collection,getDocs, getFirestore, onSnapshot, query, where, doc} from "firebase/firestore";
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
import NoMessages from "../NoMessages";
import {getSpecificUser} from "../../hooks/getSpecificUser";

const Tabs = () => {
    firebase.initializeApp(firebaseConfig);
    const currentEmail = auth.currentUser.email;
    const db = getFirestore();
    const route = useRoute();
    const len = route.params.len;
    const [notifications, setNotifications] = useState(null);
    const [ alertMode , set_alertMode ] = useState(false);
    const [ gotInfo, setGotInfo ] = useState(false);

    const backgroundColor = !alertMode ? '#fff' : '#000'
    const fontColor = !alertMode ? '#000' : '#fff'

    const [currentUser, setCurrentUser] = useState(null);
    const [inHelpGroup, setInHelpGroup] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentAlarm, setCurrentAlarm] = useState(null);
    const [alarmingUser, setAlarmingUser] = useState(null);
    const [currentScreen, setCurrentScreen] = useState('');
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [chatTitle, setChatTitle] = useState('');
    const navigation = useNavigation();

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

    const usersSnapshot = (usersQuery)=>{
        onSnapshot(usersQuery,  (querySnapshot) => {
            let foundAlarmingUser = false;
            querySnapshot.forEach((doc) => {
                    setAlarmingUser(doc.data());
                    foundAlarmingUser = true;
            });
            if(!foundAlarmingUser){
                setAlarmingUser(null);
            }
        } )
    }

    useEffect(()=>{

        if(currentAlarm !== null){
            const usersQuery = query(collection(db, "users"), where("email", "==", currentAlarm.alarmingUser));
            usersSnapshot(usersQuery);
        }
    },[currentAlarm]);


    const alarmSnapshot = (alarmQuery)=>{
        onSnapshot(alarmQuery,  (querySnapshot) => {
            let alertModeActive = false;
            let auxAlarmingUser = false;
            let helpingUser = false;
            querySnapshot.forEach((doc) => {
                if(doc.data().alarmingUser === auth.currentUser.email){
                    alertModeActive = true;
                }
                if(doc.data().users.includes(auth.currentUser.email)){
                    auxAlarmingUser = true;
                    getSpecificUser(doc.data().alarmingUser, setAlarmingUser).then();
                    setCurrentAlarm(doc.data());
                    helpingUser = true;
                }
            });
            if(!auxAlarmingUser){
                setAlarmingUser(null);
            }
            if(!helpingUser){
                setCurrentAlarm(null);
            }
            set_alertMode(alertModeActive);
        } )
    }

    const chatSnapshot = (chatQuery)=>{
        onSnapshot(chatQuery,  (querySnapshot) => {
            let inHelpGroupActive = false;
            querySnapshot.forEach((doc) => {
                if(doc.data().user === auth.currentUser.email){
                    inHelpGroupActive = true;
                    inHelpGroupActive ? setCurrentChat(doc.data()) : ()=>{};
                }
                if(doc.data().members.includes(auth.currentUser.email)){
                    inHelpGroupActive = true;
                    inHelpGroupActive ? setCurrentChat(doc.data()) : ()=>{};
                }

            });
            setInHelpGroup(inHelpGroupActive);
        } )
    }

    useEffect(() => {
        if(!gotInfo || !currentUser){
            getCurrentUser(setCurrentUser).then();
            const alarmQuery = query(collection(db, "alarms"), where("alarmingUser", "!=", ""));
            alarmSnapshot(alarmQuery);
            const chatQuery = query(collection(db, "chat"), where("user", "!=", ""));
            chatSnapshot(chatQuery);
            setGotInfo(true);
        }});



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

    useEffect( () => {
        if(!inHelpGroup){
            setCurrentChat(null);
        }
    }, [alertMode,currentUser, inHelpGroup, currentChat]);

    useEffect(()=>{
        if (currentChat) {
            if (currentChat.user !== auth.currentUser.email) {
                const db = getFirestore();
                const usersRef = collection(db, "users");
                getDocs(usersRef).then((res) => {
                    res.forEach((doc) => {
                        if (currentChat.user === doc.data().email) {
                            setChatTitle('Grupo de ayuda de ' + doc.data().username.split(" ")[0]);
                        }
                    });
                });
            } else if(currentChat.user === auth.currentUser.email){
                setChatTitle("Tu grupo de ayuda");
            }
        }
    },[currentChat])

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
                ()=><MapScreen alarmingUser={alarmingUser} currentUser={currentUser} setVisible={setTabBarVisible} visible={tabBarVisible} changeCurrentScreen={setCurrentScreen} currentScreen={currentScreen}/>
            }
                options={{
                tabBarIcon: ({ focused }) => (
                    <Feather name="map-pin" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")}ffr443 />
               
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
        <Tab.Screen name="Alarma" children={() => <AlertScreen currentUser={currentUser}/>} listeners={({ navigation }) => ({
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
          <Tab.Screen name={tabsWords[len].chats} children={
              ()=> currentChat ? <Messages currentChat={currentChat}  changeCurrentScreen={setCurrentScreen} currentScreen={currentScreen}/> : <NoMessages/>
          } options={{
            tabBarIcon: ({ focused }) => (
                <View style={styles.container}>
                    <Feather name="message-square" size={24} color={focused? (alertMode? "grey": "black"): (alertMode? "white": "grey")} />
                </View>

          ),
          header: () => (
              <View style={styles.chatHeader}>
                  <TouchableOpacity onPress={() => {
                      if(currentChat){
                          navigation.navigate("ChatMembers",{currentChat:currentChat, chatTitle:chatTitle});
                      }
                  }}>
                          <Text style={styles.chatHeaderText}>
                              {
                                  currentChat ? chatTitle : 'Mensajes'
                              }
                          </Text>
                  </TouchableOpacity>
              </View>
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontFamily: 'Spartan_700Bold',
            fontSize: 20,
            right: Platform.OS == 'ios'? '120%': 0,
            color: fontColor
          },
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
    },
    container: {
        position: 'relative',
    },
    circle: {
        position: 'absolute',
        bottom: 16,
        left: 12,
        backgroundColor: '#8555f6',
        borderRadius: 10,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    count: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    chatHeader:{
        height:100,
        backgroundColor:'black',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chatHeaderText:{
        fontFamily: 'Spartan_700Bold',
        color:'white',
        fontSize:20,
        top:'20%'
    }
})