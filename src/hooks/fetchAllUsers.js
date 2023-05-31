import {getFirestore, collection, query, where, onSnapshot} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";


export const fetchAllUsers = (setAllUsers) => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();

    const q = query(collection(db, "users"), where("email", "!=", auth.currentUser.email));
    onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push(doc.data());
        });
        setAllUsers(users);
    });

}