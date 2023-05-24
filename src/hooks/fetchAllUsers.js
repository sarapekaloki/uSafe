import {getFirestore, collection, query, where, onSnapshot} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";
import {getPreciseDistance} from "geolib";

const userIsInRadar = (currentUser,otherUser)=>{
    const distance = getPreciseDistance(
        currentUser.coordinates,
        otherUser.coordinates
    );

    return distance < currentUser.helpRadar &&
        distance < otherUser.helpRadar;
}

export const fetchAllUsers = (setAllUsers, currentUser) => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();

    const q = query(collection(db, "users"), where("email", "!=", auth.currentUser.email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const users = [];
        querySnapshot.forEach((doc) => {
            if(currentUser && userIsInRadar(currentUser,doc.data())){
                users.push(doc.data());
            }
        });
        setAllUsers(users);
    });
}
