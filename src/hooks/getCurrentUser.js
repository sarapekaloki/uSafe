import {collection, getDocs, getFirestore, onSnapshot, query, where} from "firebase/firestore";
import {auth, firebaseConfig} from "../../firebase";
import firebase from 'firebase/compat/app';

export const getCurrentUser = async (setCurrentUser, setUserLocation) => {
    firebase.initializeApp(firebaseConfig);
    const current_user_ref = auth.currentUser;
    const db = getFirestore();
    const usersRef = collection(db, "users2");
    await getDocs(usersRef).then((res) => {
        res.forEach((doc) => {
            if((doc.data().email).toLowerCase() === current_user_ref.email){
                setCurrentUser(doc.data());
                setUserLocation(doc.data().coordinates);
            }
        })
    })
}