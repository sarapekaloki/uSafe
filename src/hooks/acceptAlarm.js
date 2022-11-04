import * as Location from 'expo-location';
import {getFirestore, collection, getDocs, doc, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";
import {fetchAllUsers} from "./fetchAllUsers";


export const acceptAlarm = (setAcceptedAlarm,setVictim, focusedUser, setHelpingUser, setAllUsers) => {
    const db = getFirestore();
    const alarmsRef = collection(db, "alarms");
    getDocs(alarmsRef).then((res) => {
        res.forEach((doc) => {
            const updateDBRef = firebase.firestore().
            collection('alarms').doc(focusedUser.email);
            updateDBRef.set({
                alarmingUser:doc.data().alarmingUser,
                users:doc.data().users.concat([auth.currentUser.email])
            }).then();
            setAcceptedAlarm(doc.data());
            setHelpingUser(true);
            setVictim(focusedUser);
            fetchAllUsers(setAllUsers);
        })
    })
}