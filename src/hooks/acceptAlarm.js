import * as Location from 'expo-location';
import {getFirestore, collection, getDocs, doc, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";


export const acceptAlarm = (setAcceptedAlarm,setVictim, focusedUser) => {
    const db = getFirestore();
    const alarmsRef = collection(db, "alarms");
    getDocs(alarmsRef).then((res) => {
        res.forEach((doc) => {
            if((doc.data().alarmingUser) === focusedUser.email && !doc.data().users.includes(auth.currentUser.email)){
                const updateDBRef = firebase.firestore().
                collection('alarms').doc(focusedUser.email);
                updateDBRef.set({
                    alarmingUser:doc.data().alarmingUser,
                    users:doc.data().users.concat([auth.currentUser.email])
                }).then();
                setAcceptedAlarm(doc.data());
                setVictim(focusedUser);
            }
        })
    })
    // const q = query(collection(db, "alarms"), where("alarmingUser", "!=", ""));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //
    //     });
    // });
}