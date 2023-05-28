import {collection, getDocs, doc, getFirestore, onSnapshot, query, where} from "firebase/firestore";
import {auth, firebaseConfig} from "../../firebase";
import firebase from 'firebase/compat/app';

export const getCurrentUser = async (setCurrentUser) => {
    const db = getFirestore();
    const currentEmail = auth.currentUser.email;

    onSnapshot(doc(db, "users", currentEmail.toLowerCase()), (doc) => {
        if(doc.data()=== undefined) return;
        setCurrentUser(doc.data());
    });

    // const q = query(collection(db, "users"), where("email", "!=", ""));
    // const unsubscribe = onSnapshot(q, (querySnapshot) => {
    //     querySnapshot.forEach((doc) => {
    //         if(auth && auth.currentUser && auth.currentUser.email){
    //             if(doc.data().email.toLowerCase() === auth.currentUser.email){
    //                 setCurrentUser(doc.data());
    //             }
    //         }
    //     });
    // });
}