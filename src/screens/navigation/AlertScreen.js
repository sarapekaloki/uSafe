import * as React from 'react';
import * as Haptics from 'expo-haptics';
import { useState , useEffect } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import image1 from '../../../assets/img/buttonUnpressed.png'
import image2 from '../../../assets/img/buttonPressed2.png'
import {deleteDoc, doc, setDoc} from "firebase/firestore";
import {getFirestore, collection, query, where, onSnapshot} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import {auth, firebaseConfig} from "../../../firebase";




const AlertScreen = () =>{
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const [ gotInfo, set_gotInfo ] = useState(false);
    const modoNoAlerta = "Iniciar Modo Alerta!"
    const modoAlerta = "Terminar Modo Alerta?"
    const [ mode , set_mode ] = useState(false)
    const [ message, set_message ] = useState(modoNoAlerta);
    const [image, set_image ] = useState(image1);

    useEffect(() => {
        if(!gotInfo){
            const q = query(collection(db, "alarms"), where("alarmingUser", "==", auth.currentUser.email));
            onSnapshot(q, (querySnapshot) => {
                let alertMode = false
                querySnapshot.forEach((doc) => {
                    if(doc.data().alarmingUser === auth.currentUser.email){
                        alertMode = true
                    }
                });
                set_mode(alertMode)
            });
            set_gotInfo(true);
        }
    })

    useEffect( () => {}, [mode] )

    async function sendAlarm() {
        const docRef = doc(db, "alarms", auth.currentUser.email);
        const data = {
            alarmingUser:auth.currentUser.email,
            users:[]
        };
        mode ? await deleteDoc(docRef) : await setDoc(docRef, data)
    }

    async function changeAlert(){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        sendAlarm();
        // set_image(image === image1 ? image2 : image1);
        // console.log("Alarmita")
        // await sleep(5000);
    }

    return(
        <View style={styles.modal}>
            <TouchableOpacity
                style={styles.button2}
                onPressOut={() => changeAlert()}
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
        color: "#28194C",
        fontSize: 30,
        fontWeight: "bold",
        top: 110,
        alignSelf: "center"
    },
    modal:{
        backgroundColor: '#D4B2EF',
        flex:1,
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
