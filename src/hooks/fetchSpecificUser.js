import {collection, getDocs, getFirestore} from "firebase/firestore";
import firebase from "firebase/compat";
import {auth} from "../../firebase";


export const fetchSpecificUser = (email,setVictim)=>{
    const db = getFirestore();
    const alarmsRef = collection(db, "users2");
    getDocs(alarmsRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().email===email){
                setVictim(doc.data());
            }
        })
    })
}
