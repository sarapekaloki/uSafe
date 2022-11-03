import * as Location from 'expo-location';
import {getFirestore, collection, getDocs, doc, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";

export const fetchAllAlarms = (setAllAlarms, setAlarmingUsers, setAcceptedAlarm, setVictim, setHelpingUser) => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    let found = false;
    const q = query(collection(db, "alarms"), where("alarmingUser", "!=", ""));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        console.log('Alarm received!');
        const alarms = [];
        const alarming_users=[];
        querySnapshot.forEach((doc) => {
            alarms.push(doc.data());
            alarming_users.push(doc.data().alarmingUser);
            if(doc.data().users.includes(auth.currentUser.email)){
                setAcceptedAlarm(doc.data());
                found = true;
                setHelpingUser(found);
            }
        });
        let aux_users=[]
        for(let i=0;i<alarms.length;i++){
            aux_users.push(alarms[i].alarmingUser)
        }
        if(!aux_users.includes(auth.currentUser.email)){
            setHelpingUser(false);
        }

        setAllAlarms(alarms);
        setAlarmingUsers(alarming_users);
    });
}