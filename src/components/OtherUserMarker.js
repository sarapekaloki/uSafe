import React from "react";
import {StyleSheet, View, Text, Button, Image, TouchableOpacity} from "react-native";
import {Marker} from "react-native-maps";
import {addDoc, collection, doc, getFirestore, setDoc} from "firebase/firestore";

export const OtherUserMarker = ({
                          visible,
                          user,
                          src,
                          victim,
                          setFocusedUser,
                          handleModal
                      }) => {

    const db = getFirestore();
    const alarm = {
        alarmingUser:user.email,
        users:[]
    }
    async function sendAlarm() {
        const docRef = doc(db, "alarms", user.email);
        const data = {
            alarmingUser:user.email,
            users:[]
        };
        await setDoc(docRef, data);
    }

    return (
        <View>
            {visible &&
                <Marker
                    coordinate={user.coordinates}
                >
                    <TouchableOpacity onPress={
                        victim ? ()=>{handleModal();setFocusedUser(user)} : sendAlarm
                    }>
                        <View style={victim ? styles.victimContainer : styles.container}>
                            <Image style={victim ? styles.victim : styles.image} source={src}/>
                        </View>
                    </TouchableOpacity>
                </Marker>
            }
        </View>

    );
};

const styles = StyleSheet.create({
    image:{
        width: 35,
        height: 35,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    container:{
        borderColor: 'rgba(71, 106, 232, .5)',
        borderWidth: 6,
        borderRadius: 100,
    },
    victim:{
        width: 60,
        height: 60,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    victimContainer:{
        borderColor: 'rgba(229, 67, 67, .5)',
        borderWidth: 12,
        borderRadius: 100,
    },
})

