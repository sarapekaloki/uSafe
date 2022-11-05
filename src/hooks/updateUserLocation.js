import {getUserLocation} from "./getUserLocation";
import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {auth} from "../../firebase";

export const updateUserLocation = (userLocation, setUserLocation, currentUser) => {
    const current_user_ref=auth.currentUser
    getUserLocation(setUserLocation).then();
    const db = getFirestore();
    const userRef = doc(db, "users2", current_user_ref.email);
    updateDoc(userRef, {
        coordinates:userLocation,
        email:currentUser.email,
        helpResponses:currentUser.helpResponses,
        pictureUrl:currentUser.pictureUrl,
        username:currentUser.username
    }).then();
}