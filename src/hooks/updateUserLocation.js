import {getUserLocation} from "./getUserLocation";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {getFirestore} from "firebase/firestore";

export const updateUserLocation = (userLocation, setUserLocation, key, currentUser) => {

    getUserLocation(setUserLocation).then();
    const updateDBRef = firebase.firestore().

    collection('users2').doc(key);

    updateDBRef.set({
        coordinates:userLocation,
        email:currentUser.email,
        helpResponses:currentUser.helpResponses,
        pictureUrl:currentUser.pictureUrl,
        username:currentUser.username
    }).then();
}