import {collection, getDocs, getFirestore, onSnapshot, query, where} from "firebase/firestore";
import {auth, firebaseConfig} from "../../firebase";
import firebase from 'firebase/compat/app';

export const getSpecificUser = async (email, setAlarmingUser) => {
    const db = getFirestore();
    const usersRef = collection(db, "users2");

    await getDocs(usersRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().email === email){
                setAlarmingUser(doc.data())
            }
        })
    });
}