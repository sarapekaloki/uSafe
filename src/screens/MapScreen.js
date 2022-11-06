import {Image, StyleSheet, TouchableNativeFeedback, View} from 'react-native';
import * as React from "react";
import MapView, {Callout, Marker} from "react-native-maps";
import {useEffect, useRef, useState} from "react";
import {auth, firebaseConfig} from "../../firebase";
import firebase from 'firebase/compat/app';
import {getCurrentUser} from "../hooks/getCurrentUser";
import {updateUserLocation} from "../hooks/updateUserLocation";
import {fetchAllUsers} from "../hooks/fetchAllUsers";
import {getFirestore, doc, setDoc, deleteDoc} from "firebase/firestore";
import {OtherUserMarker} from "../components/OtherUserMarker";
import {MapModal} from "../components/MapModal";
import {RejectionMapModal} from "../components/RejectionMapModal";
import {fetchAllAlarms} from "../hooks/fetchAllAlarms";
import {acceptAlarm } from "../hooks/acceptAlarm";
import {rejectAlarm} from "../hooks/rejectAlarm";

export default function MapScreen(){
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const [currentUser, setCurrentUser] = useState(null);
    const [userLocation, setUserLocation] = useState({
        latitude:32.505008,longitude:-116.923947
    });

    const [askedForHelp, setAskedForHelp] = useState(false);
    const [currentUserAlarm, setCurrentUserAlarm] = useState(false);

    const [allUsers, setAllUsers] = useState([]);
    const [allAlarms, setAllAlarms] = useState([]);
    const [focusedUser, setFocusedUser] = useState({});
    const [acceptedAlarm, setAcceptedAlarm] = useState(null);

    const [helpingUser, setHelpingUser] = useState(false);

    const [gotInfo, setGotInfo] = useState(false);

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isRejectionModalVisible, setIsRejectionModalVisible] = useState(false);

    useEffect(() => {
        if(!gotInfo){
            fetchAllAlarms(setAllAlarms,setAcceptedAlarm,setHelpingUser, setAskedForHelp, setCurrentUserAlarm);
            fetchAllUsers(setAllUsers);
            setGotInfo(true);
        }});

    useEffect(()=>{
        if(!currentUser){
            getCurrentUser(setCurrentUser, setUserLocation).then();
        }
        else{
            setTimeout(setCurrentUserLocation, 3000);
        }
    });

    const setCurrentUserLocation = ()=> {
        updateUserLocation(
            userLocation,
            setUserLocation,
            currentUser
        );
    }


    const handleModalRejection = ()=>{
        setIsModalVisible(!isModalVisible);
    }
    const handleModalAcceptance = ()=>{
        handleModalRejection();
        acceptAlarm(focusedUser).then();
    }

    const cancelAcceptedAlarm = ()=>{
        setHelpingUser(false);
        setAcceptedAlarm(null);
        rejectAlarm(focusedUser).then();
        setIsRejectionModalVisible(false);
    }

    const sendAlarm = async () => {
        if(!helpingUser){
            const docRef = doc(db, "alarms", auth.currentUser.email);
            if(!askedForHelp){
                await setDoc(docRef, {
                    alarmingUser:auth.currentUser.email,
                    users:[]
                });
                setAskedForHelp(true);
            }
            else{
                await deleteDoc(docRef);
                setAskedForHelp(false);
            }
        }

    }

    const updateUserMarkers = ()=>{
        return allUsers.map((user,index) =>{
                return <OtherUserMarker
                    key={index}
                    visible={helpingUser ? (!!allAlarms.map((alarm)=>
                        alarm.users.includes(auth.currentUser.email) ? alarm.users : []
                    ).map(users=>users.includes(user.email))[0]) || acceptedAlarm.alarmingUser === user.email :
                        askedForHelp ? currentUserAlarm && currentUserAlarm.users.includes(user.email) :true}
                    user={user}
                    victim={allAlarms.map((alarm)=>alarm.alarmingUser).includes(user.email)}
                    setFocusedUser={setFocusedUser}
                    handleModal={helpingUser ? ()=>{
                        setIsRejectionModalVisible(!isRejectionModalVisible)
                    } : handleModalRejection}
                    src={require('../../assets/brad.jpg')}
                />
            }
        )
    }

    const map = useRef(null);

    return(
        <View style={styles.container}>
            <MapView
                ref={map}
                style={styles.map}
                initialRegion={{
                    latitude:userLocation.latitude,
                    longitude:userLocation.longitude,
                    latitudeDelta:0.09,
                    longitudeDelta:0.04
                }}
            >

                <Marker coordinate={userLocation}>
                    <TouchableNativeFeedback onPress={sendAlarm}>
                        <View style={styles.userLocation2}>
                            <Image style={styles.userLocation}/>
                        </View>
                    </TouchableNativeFeedback>
                </Marker>

                {
                    updateUserMarkers()
                }

                <Callout>
                    <MapModal
                        isVisible={isModalVisible}
                        user={focusedUser}
                        handleModalRejection={handleModalRejection}
                        handleModalAcceptance={handleModalAcceptance}
                        loggedUser={currentUser}
                    />
                    <RejectionMapModal
                        isVisible={isRejectionModalVisible}
                        user={focusedUser}
                        handleModal={()=>
                            setIsRejectionModalVisible(!isRejectionModalVisible)}
                        cancelAlarm={cancelAcceptedAlarm}
                    />
                </Callout>
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    map:{
        width:'100%',
        height:'100%'
    },
    userLocation:{
        width:20,
        height:20,
        backgroundColor: 'rgba(101, 64, 245,1)',
        borderRadius: 100,
        borderColor:'white',
        borderWidth:1
    },
    userLocation2:{
        borderWidth: 28,
        borderRadius: 100,
        borderColor: 'rgba(101, 64, 245, .3)',
    }
});


