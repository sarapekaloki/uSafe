import {getUserLocation} from "./getUserLocation";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {getFirestore} from "firebase/firestore";
import {auth} from "../../firebase";

export const updateUserLocation = (userLocation, setUserLocation, currentUser) => {
    const current_user_ref=auth.currentUser
    getUserLocation(setUserLocation).then();
    const updateDBRef = firebase.firestore().

    collection('users2').doc(current_user_ref.email);

    updateDBRef.set({
        coordinates:userLocation,
        email:currentUser.email,
        helpResponses:currentUser.helpResponses,
        pictureUrl:currentUser.pictureUrl,
        username:currentUser.username
    }).then();
}