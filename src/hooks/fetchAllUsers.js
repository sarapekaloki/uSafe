import * as Location from 'expo-location';
import {getFirestore, collection, getDocs, doc, updateDoc, query, where, onSnapshot} from "firebase/firestore";
import {useState} from "react";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";

export const fetchAllUsers = (setAllUsers) => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();

    const q = query(collection(db, "users2"), where("email", "!=", auth.currentUser.email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        setAllUsers(users);
    });
}
