import {getFirestore, collection, query, where, onSnapshot} from "firebase/firestore";
import firebase from 'firebase/compat/app';
import {firebaseConfig} from "../../firebase";
import {auth} from "../../firebase";

export const fetchAllAlarms = (setAllAlarms,setAcceptedAlarm,setHelpingUser,setAskedForHelp, setCurrentUserAlarm) => {
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const q = query(collection(db, "alarms"), where("alarmingUser", "!=", ""));
    onSnapshot(q, (querySnapshot) => {
        let aux_alarms=[];
        let aux_helping_user = false;
        let user_asked_for_help=false;
        querySnapshot.forEach((doc) => {
            aux_alarms.push(doc.data());
            if(doc.data().users.includes(auth.currentUser.email)){
                setAcceptedAlarm(doc.data());
                aux_helping_user=true;
            }
            else if(doc.data().alarmingUser === auth.currentUser.email){
                setCurrentUserAlarm(doc.data());
                user_asked_for_help=true;
            }
        });
        setAllAlarms(aux_alarms);
        setHelpingUser(aux_helping_user);
        if(!aux_helping_user){
            setAcceptedAlarm(null);
        }
        if(!user_asked_for_help){
            setCurrentUserAlarm(null);
        }
    });
}