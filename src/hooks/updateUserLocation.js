import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {auth} from "../../firebase";
import * as Location from "expo-location";

export const updateUserLocation = async (currentUser) => {
    const db = getFirestore();
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
        if(auth && auth.currentUser && auth.currentUser.email){
            const userRef = doc(db, "users2", auth.currentUser.email);
            const userObject = {
                coordinates:{latitude:0,longitude: 0},
                email:auth.currentUser.email,
                helpResponses:currentUser.helpResponses,
                pictureUrl:currentUser.pictureUrl,
                username:currentUser.username
            }
            updateDoc(userRef, userObject).then();
        }
        return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    }

    if(current.latitude && current.longitude){
        if(auth && auth.currentUser && auth.currentUser.email){
            const userRef = doc(db, "users2", auth.currentUser.email);
            const userObject = {
                coordinates:current,
                email:auth.currentUser.email,
                helpResponses:currentUser.helpResponses,
                pictureUrl:currentUser.pictureUrl,
                username:currentUser.username
            }
            updateDoc(userRef, userObject).then();
        }
    }
}