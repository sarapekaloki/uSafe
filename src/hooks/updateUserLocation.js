import {doc, getFirestore, updateDoc} from "firebase/firestore";
import {auth} from "../../firebase";
import * as Location from "expo-location";

export const updateUserLocation = async (userLocation, currentUser, setCurrentUser) => {
    const db = getFirestore();
    let { status } = await Location.requestForegroundPermissionsAsync();
    if(status !== 'granted'){
        alert('Permission denied');
        return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
    }

    if(current.latitude && current.longitude){
        if(auth){
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