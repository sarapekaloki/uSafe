import {collection, getDocs, getFirestore, onSnapshot, query, where} from "firebase/firestore";
import {auth, firebaseConfig} from "../../firebase";
import firebase from 'firebase/compat/app';

export const getCurrentUser = async (setCurrentUser) => {
    const db = getFirestore();

    const q = query(collection(db, "users2"), where("email", "!=", ""));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if(doc.data().email.toLowerCase() === auth.currentUser.email){
                setCurrentUser(doc.data());
            }
        });
    });
}