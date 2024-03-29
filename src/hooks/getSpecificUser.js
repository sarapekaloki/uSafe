import {collection, getDocs, getFirestore, onSnapshot, query, where} from "firebase/firestore";
import {auth, firebaseConfig} from "../../firebase";
import firebase from 'firebase/compat/app';

export const getSpecificUser = async (email, setUser) => {
    const db = getFirestore();
    const usersRef = collection(db, "users");

    await getDocs(usersRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().email === email){
                setUser(doc.data())
            }
        })
    });
}