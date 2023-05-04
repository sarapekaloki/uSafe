import * as React from 'react';
import { useState , useEffect } from 'react';
import { fetchAllUsers } from '../../hooks/fetchAllUsers';
import {View, Text, TouchableOpacity, StyleSheet, Image, Platform, Vibration} from 'react-native';
import image1 from '../../../assets/img/buttonUnpressed.png'
import image2 from '../../../assets/img/buttonPressed2.png'
import {deleteDoc, doc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import {getFirestore, collection, query, where, onSnapshot} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import {auth, firebaseConfig} from "../../../firebase";
import {getCurrentUser} from "../../hooks/getCurrentUser";

import {
    useFonts,
    Roboto_700Bold,
    Roboto_400Regular
  } from '@expo-google-fonts/roboto';

const sleep = (milliseconds) => {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

const AlertScreen = () =>{
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const [ gotInfo, set_gotInfo ] = useState(false);
    const modoNoAlerta = "¡Iniciar Modo Alerta!"
    const modoAlerta = "¿Terminar Modo Alerta?"
    const [ mode , set_mode ] = useState(false)
    const [ currentUser , set_currentUser] = useState({})
    const [ helping, set_helping ] = useState(false)
    const [allUsers, SetAllUsers] = useState([])
    const tabColor = Platform.OS =='ios'? '#c9c9c9':'#a3a3a3';

    useEffect( () => {
        if(!gotInfo){
            if(auth){
                getCurrentUser(set_currentUser).then();
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
            fetchAllUsers(SetAllUsers);
        }
    })

    useEffect( () => {
    }, [mode,helping,currentUser] )


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
            allUsers.forEach(user => {
                if((user.email != currentUser.email) && user.token != ""){
                    if(user.token != currentUser.token){
                        // sendNotification(user.token);
                    }
                }
            })
        }
        else{
            alert("¡No puedes entrar en modo alerta mientras ayudas a alguien!")
        }
    
    }

    const sendNotification = async (userToken) => {
        const message = {
            to: userToken,
            sound: 'default',
            title: 'uSafe',
            body:  `¡${currentUser.username} necesita ayuda!`,
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
        let users;
        const alarmRef = collection(db, "alarms");
        await getDocs(alarmRef).then((res) => {
            res.forEach((doc) => {
                if((doc.data().alarmingUser).toLowerCase() === auth.currentUser.email){
                    users = doc.data().users
                }
            })
        })
            const allUsers = collection(db, "users");
            await getDocs(allUsers).then((res) => {
                res.forEach((document) => {
                    if(users.includes(document.data().email)){
                        const usersRef = doc(db, "users", document.data().email);
                        updateDoc(usersRef, {
                            coordinates:document.data().coordinates,
                            email:document.data().email,
                            helpResponses:document.data().helpResponses + 1,
                            pictureUrl:document.data().pictureUrl,
                            username:document.data().username,
                            token: document.data().token
                        }).then();
                    }
                })
            })

        const docRef = doc(db, "alarms", auth.currentUser.email);
        await deleteDoc(docRef);
        const chatRef = doc(db, "chat", auth.currentUser.email);
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
            <View style={[styles.pullTab, {backgroundColor: tabColor}]}>
            </View>
            <TouchableOpacity
                style={styles.button2}
                onPress={() => changeAlert()}
            >
                <Image source={mode ? image2 : image1} style={styles.buttonImage}/>
            </TouchableOpacity>
            <Text style={styles.message}>
                {mode ? modoAlerta : modoNoAlerta}
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
