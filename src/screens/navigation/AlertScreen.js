import * as React from 'react';
import { useState , useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { fetchAllUsers } from '../../hooks/fetchAllUsers';
import {View, Text, TouchableOpacity, StyleSheet, Image, Platform, Vibration, StatusBar} from 'react-native';
import image1 from '../../../assets/img/buttonUnpressed.png'
import image2 from '../../../assets/img/buttonPressed2.png'
import {deleteDoc, doc, getDocs, setDoc, updateDoc, Timestamp} from "firebase/firestore";
import {getFirestore, collection, query, where, onSnapshot} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import {auth, firebaseConfig} from "../../../firebase";
import {getCurrentUser} from "../../hooks/getCurrentUser";

import { alertTabWords } from '../../lenguagesDicts/alertTabWords';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendNotification } from '../../hooks/sendNotification';
import {
    useFonts,
    Roboto_700Bold
  } from '@expo-google-fonts/roboto';
import {getPreciseDistance} from "geolib";

const sleep = (milliseconds) => {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

// Falta agregar pantalla cuando no hay ubicación

const AlertScreen = (props) =>{
    firebase.initializeApp(firebaseConfig);
    const [len, setLen] = useState('EN');
    AsyncStorage.getItem('len').then(res => {
        setLen(res)
   });
    const db = getFirestore();
    const [ gotInfo, set_gotInfo ] = useState(false);
    const [ mode , set_mode ] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [ helping, set_helping ] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [usersInRadar, setUsersInRadar] = useState([]);
    const tabColor = Platform.OS =='ios'? '#c9c9c9':'#a3a3a3';
    const navigation = useNavigation();

    useEffect( () => {
        if(!gotInfo){
            if(auth){
                const q = query(collection(db, "alarms"), where("alarmingUser", "!=", ""));
                onSnapshot(q, (querySnapshot) => {
                        let alertMode = false
                        let aux = false
                    if(auth && auth.currentUser && auth.currentUser.email){
                        querySnapshot.forEach((doc) => {
                            if(doc.data().users.includes(auth.currentUser.email)){
                                aux = true;
                            }
                            else if(doc.data().alarmingUser === auth.currentUser.email){
                                alertMode = true
                            }
                        });
                        set_mode(alertMode);
                        set_helping(aux);
                    }
                });
                set_gotInfo(true);
            }
            fetchAllUsers(setAllUsers);
            getCurrentUser(setCurrentUser);
        }
    })

    useEffect(()=>{
        if(currentUser){
            const aux = [];
            for(let i=0;i<allUsers.length;i++){
                if(userIsInRadar(allUsers[i])){
                    aux.push(allUsers[i]);
                }
            }
            setUsersInRadar(aux);
        }
    },[allUsers,currentUser]);


    useEffect(()=>{
    },[usersInRadar])

    const userIsInRadar = (otherUser)=>{
        const distance = getPreciseDistance(
            currentUser.coordinates,
            otherUser.coordinates
        );
        return  distance < currentUser.helpRadar && distance < otherUser.helpRadar;
    }

    async function sendAlarm() {
        if(!helping){
            Vibration.vibrate(2000);
            const alarmsRef = doc(db, "alarms", auth.currentUser.email);
            const alarmData = {
                alarmingUser:auth.currentUser.email,
                users:[]
            };
            const chatRef = doc(db, "chat", auth.currentUser.email);
            const chatData = {
                user:auth.currentUser.email,
                messages:[],
                members:[],
            };
            await setDoc(alarmsRef, alarmData);
            await setDoc(chatRef, chatData);
        
            usersInRadar.forEach(user => {
                sendNotification(user.email, "alert", currentUser.username);
                if((user.email != currentUser.email) && user.token != ""){
                    if(user.token != currentUser.token){
                        sendPushNotification(user.token);
                    }
                }
            })
        }
        else{
            alert(alertTabWords[len].notAvailableMessage)
        }
    
    }


    const sendPushNotification = async (userToken) => {
        const message = {
            to: userToken,
            sound: 'default',
            title: 'uSafe',
            body:  `${currentUser.username} ${alertTabWords[len].notificationMessage}`,
            data: { someData:'' },
          };
        await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        });
    }

    async function cancelAlarm() {
        let chatRef = collection(db, "chat");

        let chat = null;
        await getDocs(chatRef).then((res) => {
            res.forEach((doc) => {
                if(doc.data().user === auth.currentUser.email){
                    chat = doc.data().members
                }
            })
        });

        let users;
        const alarmRef = collection(db, "alarms");
        await getDocs(alarmRef).then((res) => {
            res.forEach((doc) => {
                if((doc.data().alarmingUser).toLowerCase() === auth.currentUser.email){
                    users = doc.data().users
                }
            })
        })
        users.forEach(user => {
            sendNotification(user, "completeAlert", currentUser.username)
        })
        const allUsers = collection(db, "users");
        await getDocs(allUsers).then((res) => {
            res.forEach((document) => {
                if(users.includes(document.data().email)){
                    const usersRef = doc(db, "users", document.data().email);
                    updateDoc(usersRef, {
                        coordinates: document.data().coordinates,
                        email: document.data().email,
                        helpResponses: document.data().helpResponses+1,
                        pictureUrl: document.data().pictureUrl,
                        username: document.data().username,
                        token: document.data().token,
                        len:document.data().len,
                        likes:document.data().likes,
                        helpRadar:document.data().helpRadar,
                        reportedBy:document.data().reportedBy,
                        reported:document.data().reported
                    }).then();
                }
            })
        })

        if(chat !== null && chat.length > 0){
            navigation.navigate("WhoHelpedYou",{chat, currentUser});
        }


        const docRef = doc(db, "alarms", auth.currentUser.email);
        await deleteDoc(docRef);
        chatRef = doc(db, "chat", auth.currentUser.email);
        await deleteDoc(chatRef);
        Vibration.vibrate(2000)

    }

    async function changeAlert(){
        mode ?  cancelAlarm() : sendAlarm();
        sleep(3000);
    }

    let [fontsLoaded] = useFonts({
        Roboto_700Bold,
    });

    return(
        <View style={{
            backgroundColor:'black',
            flex: 1
        }}>
             <StatusBar barStyle={"default"}></StatusBar>

            <View style={[styles.pullTab, {backgroundColor: tabColor}]}>
            </View>
            <TouchableOpacity
                style={styles.button2}
                onPress={() => changeAlert()}
            >
                <Image source={mode ? image2 : image1} style={styles.buttonImage}/>
            </TouchableOpacity>
            <Text style={styles.message}>
                {mode ? alertTabWords[len].endAlert : alertTabWords[len].startAlert}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    message:{
        color: "white",
        fontSize: 30,
        fontFamily: 'Roboto_700Bold',
        top: 110,
        alignSelf: "center"
    },
    pullTab:{
        width: 100,
        height:7,
        alignSelf:'center',
        marginTop: 7,
        borderRadius: 10
    },
    button: {
        height: 50,
        width: 150,
        backgroundColor: "#28194C",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        shadowColor: "#D4B2EF",
        shadowOpacity: 0.7,
        shadowOffset: {
            height: 4,
            width: 4,
        },
        shadowRadius: 5,
        elevation: 6,
    },
    button2:{
        height: 50,
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginTop: 240,
        marginLeft:'31%'
    },
    buttonImage:{
        width:'154%',
        height:'460%'
    },
    text: {
        color: "white",
        fontWeight: "600",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

});

export default AlertScreen;
