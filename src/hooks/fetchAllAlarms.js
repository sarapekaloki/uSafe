import * as Location from 'expo-location';
import { getFirestore, collection, getDocs, doc, updateDoc} from "firebase/firestore";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";

export const fetchAllAlarms = (setAllAlarms) => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const alarmsRef = collection(db, "alarms");

    const aux_alarms = [];
    getDocs(alarmsRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().alarmingUser !== 'big@gmail.com'){
                aux_alarms.push(doc.data());
                setAllAlarms(aux_alarms);
            }
        })
    })
}