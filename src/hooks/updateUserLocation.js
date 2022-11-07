import {getUserLocation} from "./getUserLocation";
import {collection, doc, getDocs, getFirestore, updateDoc} from "firebase/firestore";
import {auth} from "../../firebase";

export const updateUserLocation = async (userLocation, setUserLocation, currentUser) => {
    let current_user_ref;
    if(current_user_ref){
        const db = getFirestore();
        const usersRef = collection(db, "users2");
        await getDocs(usersRef).then((res) => {
            res.forEach((doc) => {
                if((doc.data().email).toLowerCase() === auth.currentUser.email){
                    current_user_ref= doc.data()
                }
            })
        })
        getUserLocation(setUserLocation).then();
        const userRef = doc(db, "users2", current_user_ref.email);
        updateDoc(userRef, {
            coordinates:userLocation,
            email:current_user_ref.email,
            helpResponses:current_user_ref.helpResponses,
            pictureUrl:current_user_ref.pictureUrl,
            username:current_user_ref.username
        }).then();
    }
}