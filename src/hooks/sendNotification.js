
import {doc, getDoc, setDoc, Timestamp, getFirestore} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";

export async function sendNotification(email, type, currentUser) {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const newNotification = {
            "time": Timestamp.now(),
            "type": type,
            "user": currentUser
    }
    const docRef = doc(db, "notifications", email)

    const documentSnapshot = await getDoc(docRef);
    if (documentSnapshot.exists()) {
        const data = documentSnapshot.data();
        let currentNotifications = data.notifications || [];
        currentNotifications.push(newNotification);
        const newDoc = {
            "notifications": currentNotifications
        }

        await setDoc(docRef, newDoc);
    } 
  
}
