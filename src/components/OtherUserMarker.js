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

                <Marker
                    coordinate={user.coordinates}
                >
                    <TouchableOpacity onPress={
                        victim ? ()=>{handleModal();setFocusedUser(user)} : sendAlarm
                    }>
                        <View style={victim ?
                            [styles.victimContainer,visible ? {borderWidth: 12} :
                                {borderWidth:0}] :
                            [styles.container, visible ? {borderWidth: 6} :
                                {borderWidth:0}]}>
                            <Image style={victim ?
                                [styles.victim,visible ? {width:60,height:60} :
                                    {width:0,height:0}] :
                                [styles.image,visible ? {width:35,height:35} :
                                    {width:0,height:0}]} source={src}/>
                        </View>
                    </TouchableOpacity>
                </Marker>

        </View>

    );
};

const styles = StyleSheet.create({
    image:{
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    container:{
        borderColor: 'rgba(71, 106, 232, .5)',
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

