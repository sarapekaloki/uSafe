import {getFirestore, collection, getDocs, doc, setDoc, getDoc} from "firebase/firestore";
import {auth} from "../../firebase";

export const acceptAlarm = async (focusedUser) => {
    const db = getFirestore();
    const alarmsRef = collection(db, "alarms");
  
    async function sendAlarm(alarm) {
        const docRef = doc(db, "alarms", focusedUser.email);
        await setDoc(docRef, alarm);
        await sendNotification();
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
    });

    const sendNotification = async () => {
        const db = getFirestore();
        const docRef = doc(db, "users", auth.currentUser.email);
        const docSnap = await getDoc(docRef);
        const message = {
            to: focusedUser.token,
            sound: 'default',
            title: 'uSafe',
            body:  `${docSnap.data().username} ha aceptado tu pedido de ayuda.`,
            data: { someData:'' },
          };
        await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
        });
    }
}