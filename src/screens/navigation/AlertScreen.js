import * as React from 'react';
import * as Haptics from 'expo-haptics';
import { useState , useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image, Platform, Vibration} from 'react-native';
import image1 from '../../../assets/img/buttonUnpressed.png'
import image2 from '../../../assets/img/buttonPressed2.png'
import image3 from '../../../assets/img/buttonUnpressedGray.png';
import {deleteDoc, doc, getDocs, setDoc, updateDoc} from "firebase/firestore";
import {getFirestore, collection, query, where, onSnapshot} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import {auth, firebaseConfig} from "../../../firebase";



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
    const tabColor = Platform.OS =='ios'? '#c9c9c9': userIsInZone()?'#D4B2EF': '#a3a3a3'
    // const backgroundColor = userIsInZone() ? '#D4B2EF' : '#a3a3a3';

    async function fetchCurrentUser(){
        const usersRef = collection(db, "users2");
        await getDocs(usersRef).then((res) => {
            res.forEach((doc) => {
                if((doc.data().email).toLowerCase() === auth.currentUser.email){
                    set_currentUser(doc.data());
                }
            })
        })
    }

    useEffect( () => {
        if(!gotInfo){
            if(auth){
                fetchCurrentUser().then();
                const q = query(collection(db, "alarms"), where("alarmingUser", "!=", ""));
                onSnapshot(q, (querySnapshot) => {
                    let alertMode = false
                    let aux = false
                    querySnapshot.forEach((doc) => {
                        if(doc.data().alarmingUser === auth.currentUser.email) {
                            alertMode = true
                        }
                        if(doc.data().users.includes(auth.currentUser.email)){
                            aux = true
                        }
                    });
                    set_mode(alertMode)
                    set_helping(aux)
                });
                set_gotInfo(true);
            }
        }
    })

    useEffect( () => {
    }, [mode,helping] )

    function userIsInZone(){
        if(currentUser && currentUser.coordinates && currentUser.coordinates.latitude && currentUser.coordinates.longitude){
            return ((currentUser.coordinates.longitude > -116.925793) && (currentUser.coordinates.longitude < -116.922382))
                && currentUser.coordinates.latitude < 32.508180 && currentUser.coordinates.latitude > 32.505300;
        }
        return false;
    }

    async function sendAlarm() {
        if(userIsInZone()){
            if(!helping){
                const docRef = doc(db, "alarms", auth.currentUser.email);
                const data = {
                    alarmingUser:auth.currentUser.email,
                    users:[]
                };
                await setDoc(docRef, data)
            }
            else{
                alert("¡No puedes entrar en modo alerta mientras ayudas a alguien!")
            }
        }
        else{
            alert("¡No puedes entrar en modo alerta fuera de CETYS!")
        }

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
            const allUsers = collection(db, "users2");
            await getDocs(allUsers).then((res) => {
                res.forEach((document) => {
                    if(users.includes(document.data().email)){
                        const usersRef = doc(db, "users2", document.data().email);
                        updateDoc(usersRef, {
                            coordinates:document.data().coordinates,
                            email:document.data().email,
                            helpResponses:document.data().helpResponses + 1,
                            pictureUrl:document.data().pictureUrl,
                            username:document.data().username
                        }).then();
                    }
                })
            })

        const docRef = doc(db, "alarms", auth.currentUser.email);
        await deleteDoc(docRef)
    }

    async function changeAlert(){
        Vibration.vibrate(2000)
        mode ?  cancelAlarm() : sendAlarm();
        sleep(5000);
    }

    return(
        <View style={{
            backgroundColor: userIsInZone() ? '#D4B2EF' : '#a3a3a3',
            flex: 1
        }}>
            <View style={[styles.pullTab, {backgroundColor: tabColor}]}>
            </View>
            <TouchableOpacity
                style={styles.button2}
                onPress={() => changeAlert()}
            >
                <Image source={userIsInZone() ? (mode ? image2 : image1) : image3} style={styles.buttonImage}/>
            </TouchableOpacity>
            <Text style={styles.message}>
                {mode ? modoAlerta : modoNoAlerta}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    message:{
        color: "#28194C",
        fontSize: 30,
        fontWeight: "bold",
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
