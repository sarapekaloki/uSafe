import * as Location from 'expo-location';
import { getFirestore, collection, getDocs, doc, updateDoc} from "firebase/firestore";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";

export const fetchAllUsers = async (setAllUsers) => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const usersRef = collection(db, "users2");

    const aux_users = [];
    await getDocs(usersRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().email && doc.data().email !== 'big@gmail.com'){
                aux_users.push(doc.data());
                setAllUsers(aux_users);
            }
        })
    })
}