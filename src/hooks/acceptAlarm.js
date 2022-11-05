import {getFirestore, collection, getDocs, doc, setDoc} from "firebase/firestore";
import {auth} from "../../firebase";



export const acceptAlarm = async (focusedUser) => {
    const db = getFirestore();
    const alarmsRef = collection(db, "alarms");

    async function sendAlarm(alarm) {
        const docRef = doc(db, "alarms", focusedUser.email);
        await setDoc(docRef, alarm);
    }

    await getDocs(alarmsRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().alarmingUser === focusedUser.email){
                sendAlarm({
                    alarmingUser:doc.data().alarmingUser,
                    users:doc.data().users.concat([auth.currentUser.email])
                });
            }
        })
    })
}