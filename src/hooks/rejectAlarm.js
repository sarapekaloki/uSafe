import {getFirestore, collection, getDocs, doc, setDoc} from "firebase/firestore";
import {auth} from "../../firebase";

export const rejectAlarm = async (focusedUser) => {
    const db = getFirestore();
    const alarmsRef = collection(db, "alarms");
    const chatRef = collection(db, "chat");

    async function rejectAlarm(alarm) {
        const docRef = doc(db, "alarms", focusedUser.email);
        await setDoc(docRef, alarm);
    }
    async function abandonChat(chat) {
        const docRef = doc(db, "chat", focusedUser.email);
        await setDoc(docRef, chat);
    }

    await getDocs(alarmsRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().alarmingUser === focusedUser.email){
                const users=doc.data().users;
                if(users){
                    const index = users.indexOf(auth.currentUser.email);
                    if(index > -1){
                        users.splice(index,1);
                    }
                    rejectAlarm({
                        alarmingUser:doc.data().alarmingUser,
                        users:users
                    });
                }
            }
        })
    })
    await getDocs(chatRef).then((res) => {
        res.forEach((doc) => {
            if(doc.data().user === focusedUser.email){
                const users=doc.data().members;
                if(users){
                    const index = users.indexOf(auth.currentUser.email);
                    if(index > -1){
                        users.splice(index,1);
                    }
                    abandonChat({
                        user:doc.data().user,
                        members:users,
                        messages: doc.data().messages,
                    });
                }
            }
        })
    })
}