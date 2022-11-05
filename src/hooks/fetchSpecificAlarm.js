import {collection, getDocs, getFirestore} from "firebase/firestore";
import firebase from "firebase/compat";
import {auth} from "../../firebase";


export const fetchSpecificAlarm = (email, setHelpingUsers)=>{
    const db = getFirestore();
    const alarmsRef = collection(db, "alarms");
    getDocs(alarmsRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().alarmingUser===email){
                setHelpingUsers(doc.data().users);
            }
        })
    })
}
