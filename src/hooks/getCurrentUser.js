import {collection, getDocs, getFirestore} from "firebase/firestore";
import {auth} from "../../firebase";

export const getCurrentUser = async (setCurrentUser, setUserLocation) => {
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