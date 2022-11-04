import * as Location from 'expo-location';
import {getFirestore, collection, getDocs, doc, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";
import {fetchSpecificUser} from "./fetchSpecificUser"
import {fetchAllUsers} from "./fetchAllUsers";

export const fetchAllAlarms = (setAllAlarms, setAlarmingUsers, setAcceptedAlarm,setHelpingUser,setVictim,setAllUsers) => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const q = query(collection(db, "alarms"), where("alarmingUser", "!=", ""));
    onSnapshot(q, (querySnapshot) => {
        let aux_alarms=[];
        let aux_alarming_users=[];
        querySnapshot.forEach((doc) => {
            aux_alarming_users.push(doc.data().alarmingUser);
            aux_alarms.push(doc.data());

            if(doc.data().users.includes(auth.currentUser.email)){
                setAcceptedAlarm(doc.data());
                setHelpingUser(true);
                fetchSpecificUser(doc.data().alarmingUser,setVictim);
                fetchAllUsers(setAllUsers);
            }
        });
        setAllAlarms(aux_alarms);
        setAlarmingUsers(aux_alarming_users);
    });
}