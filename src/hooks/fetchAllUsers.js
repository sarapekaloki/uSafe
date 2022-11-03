import * as Location from 'expo-location';
import { getFirestore, collection, getDocs, doc, updateDoc} from "firebase/firestore";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";

export const fetchAllUsers = (setAllUsers) => {
    const current_user_ref = auth.currentUser;
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const usersRef = collection(db, "users2");

    const aux_users = [];
    getDocs(usersRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().email && doc.data().email !== current_user_ref.email){
                aux_users.push(doc.data());
                setAllUsers(aux_users);
            }
        })
    })
}