import {Image, StyleSheet, View} from 'react-native';
import * as React from "react";
import MapView, {Callout, Marker} from "react-native-maps";
import {useEffect, useRef, useState} from "react";
import {auth, firebaseConfig} from "../../firebase";
import firebase from 'firebase/compat/app';
import {getCurrentUser} from "../hooks/getCurrentUser";
import {updateUserLocation} from "../hooks/updateUserLocation";
import {fetchAllUsers} from "../hooks/fetchAllUsers";
import {OtherUserMarker} from "../components/OtherUserMarker";
import {MapModal} from "../components/MapModal";
import {RejectionMapModal} from "../components/RejectionMapModal";
import {fetchAllAlarms} from "../hooks/fetchAllAlarms";
import {acceptAlarm } from "../hooks/acceptAlarm";
import {rejectAlarm} from "../hooks/rejectAlarm";

export default function MapScreen(){
    firebase.initializeApp(firebaseConfig);
    const [currentUser, setCurrentUser] = useState(null);
    const [askedForHelp, setAskedForHelp] = useState(false);
    const [currentUserAlarm, setCurrentUserAlarm] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [allAlarms, setAllAlarms] = useState([]);
    const [focusedUser, setFocusedUser] = useState({});
    const [acceptedAlarm, setAcceptedAlarm] = useState(null);
    const [helpingUser, setHelpingUser] = useState(false);
    const [gotInfo, setGotInfo] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [locationPermission, setLocationPermission] = useState(false);
    const [isRejectionModalVisible, setIsRejectionModalVisible] = useState(false);
    const [userLocation, setUserLocation] = useState({
        latitude:32.506418,longitude: -116.923893
    });


    useEffect(() => {
        if(!gotInfo || !currentUser){
            getCurrentUser(setCurrentUser).then();
            fetchAllAlarms(setAllAlarms,setAcceptedAlarm,setHelpingUser, setAskedForHelp, setCurrentUserAlarm);
            fetchAllUsers(setAllUsers);
            setGotInfo(true);

    }});

    useEffect(()=>{
    },[currentUser]);

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

    const setUserVisibility = (user) => {
        if(!askedForHelp){
            if(helpingUser){
                return acceptedAlarm.alarmingUser === user.email ||
                    acceptedAlarm.users.includes(user.email)
            }
            return allAlarms.map((alarm)=>alarm.alarmingUser).includes(user.email) ||
                (acceptedAlarm && acceptedAlarm.users.includes(user.email)) || userIsInZone(user);
        }
        return currentUserAlarm && currentUserAlarm.users.includes(user.email);

    }

    function userIsInZone(user){
        if(user){
            return ((user.coordinates.longitude > -116.925975) && (user.coordinates.longitude < -116.922080))
                && user.coordinates.latitude < 32.508246 && user.coordinates.latitude > 32.505197;
        }
        return false;

    }


    const updateUserMarkers = ()=>{
        return allUsers.map((user,index) =>{
                return <OtherUserMarker
                    key={index}
                    visible={setUserVisibility(user)}
                    user={user}
                    victim={allAlarms.map((alarm)=>alarm.alarmingUser).includes(user.email)}
                    setFocusedUser={setFocusedUser}
                    handleModal={helpingUser ? ()=>{
                        setIsRejectionModalVisible(!isRejectionModalVisible)
                    } : handleModalRejection}
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
                    latitudeDelta:0.004,
                    longitudeDelta:0.004
                }}
            >

                <Marker coordinate={currentUser ? currentUser.coordinates : userLocation}>
                    <View style={[styles.userLocation2, {borderColor:askedForHelp?'rgba(98, 0, 255, 0.3)':'rgba(0, 66, 255, 0.3)' }]}>
                        <Image style={[styles.userLocation, {backgroundColor: askedForHelp? '#6540F5': '#0035f2'}]}/>
                    </View>
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
        borderRadius: 100,
        borderColor:'white',
        borderWidth:1
    },
    userLocation2:{
        borderWidth: 28,
        borderRadius: 100,
    }
});


