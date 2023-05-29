import {getFirestore, collection, getDocs, doc, setDoc, getDoc} from "firebase/firestore";
import {auth} from "../../firebase";
import { sendNotification } from "./sendNotification";

export const acceptAlarm = async (focusedUser, currentUser, len) => {
    const db = getFirestore();
    const alarmsRef = collection(db, "alarms");
    const chatRef = collection(db, "chat");
  
    async function sendAlarm(alarm) {
        await setDoc(docRef, alarm);
        if(focusedUser.token != ""){
            await sendPushNotification(); 
        }
        sendNotification(focusedUser.email, "help", currentUser.username)
    }

    async function modifyChat(chat) {
        const docRef = doc(db, "chat", focusedUser.email);
        await setDoc(docRef, chat);
    }

    await getDocs(alarmsRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().alarmingUser === focusedUser.email){
                sendAlarm({
                    alarmingUser:doc.data().alarmingUser,
                    users:doc.data().users.concat([auth.currentUser.email]),
                });
            }
        })
    });
    await getDocs(chatRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().user === focusedUser.email){
                modifyChat({
                    user:doc.data().user,
                    members:doc.data().members.concat([auth.currentUser.email]),
                    messages: doc.data().messages
                });
            }
        })
    });

    const sendPushNotification = async () => {
        const db = getFirestore();
        const docRef = doc(db, "users", auth.currentUser.email);
        const docSnap = await getDoc(docRef);
        const messageText = len == "EN"? "accepted your help request.": "ha aceptado tu pedido de ayuda."
        const message = {
            to: focusedUser.token,
            sound: 'default',
            title: 'uSafe',
            body:  `${docSnap.data().username} ${messageText}`,
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