import {Image, StyleSheet, DevSettings, TouchableOpacity, TouchableHighlight, Touchable, TouchableNativeFeedback, TouchableWithoutFeedback, View} from 'react-native';
import * as React from "react";
import MapView, {Callout, Marker} from "react-native-maps";
import {useEffect, useRef, useState} from "react";
import {auth, firebaseConfig} from "../../../firebase";
import firebase from 'firebase/compat/app';
import {getCurrentUser} from "../../hooks/getCurrentUser";
import {updateUserLocation} from "../../hooks/updateUserLocation";
import {fetchAllUsers} from "../../hooks/fetchAllUsers";
import {getFirestore, collection, getDocs, doc, updateDoc, addDoc, onSnapshot, query, where} from "firebase/firestore";
import {OtherUserMarker} from "../../components/OtherUserMarker";
import {MapModal} from "../../components/MapModal";
import {fetchAllAlarms} from "../../hooks/fetchAllAlarms";
import {acceptAlarm } from "../../hooks/acceptAlarm";

export default function MapScreen({navigation}){
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();

    const [currentUser, setCurrentUser] = useState(null);
    const [userLocation, setUserLocation] = useState({
        latitude:32.505008,longitude:-116.923947
    });

    const [allUsers, setAllUsers] = useState([]);
    const [allAlarms, setAllAlarms] = useState([]);
    const [alarmingUsers, setAlarmingUsers] = useState([]);
    const [focusedUser, setFocusedUser] = useState({});

    const [acceptedAlarm, setAcceptedAlarm] = useState({});
    const [victim, setVictim] = useState({});

    const [helpingUser, setHelpingUser] = useState(false);

    const [gotInfo, setGotInfo] = useState(false);

    useEffect(() => {
        if(!gotInfo){
            fetchAllAlarms(setAllAlarms, setAlarmingUsers, setAcceptedAlarm, setVictim, setHelpingUser);
            console.log(allAlarms);
            fetchAllUsers(setAllUsers);
            setGotInfo(true);

    }});

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(()=>{
        if(!currentUser){
            getCurrentUser(setCurrentUser, setUserLocation);
        }
        else{
            setTimeout(setCurrentUserLocation, 3000);
        }
    });



    const updateUserMarkers = ()=>{
            return allUsers.map((user,index) =>{
                    return <OtherUserMarker
                        key={index}
                        visible={
                        helpingUser ?
                            (acceptedAlarm.users && acceptedAlarm.users.includes(user.email)
                                || user.email===victim.email)
                            : true}
                        user={user}
                        victim={alarmingUsers.includes(user.email)}
                        setFocusedUser={setFocusedUser}
                        handleModal={helpingUser ? ()=>{} : handleModalRejection}
                        src={require('../../../assets/brad.jpg')}
                                    />
                }
            )
    }

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
        setHelpingUser(true);
        for(let i=0;i<allAlarms.length;i++){
            if(allAlarms[i].alarmingUser === focusedUser.email){
                acceptAlarm(setAcceptedAlarm, setVictim, focusedUser);
                console.log(acceptedAlarm);
                setVictim(focusedUser);
            }
        }
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

                <Marker coordinate={userLocation} onCalloutPress={()=>{console.log('Pressed')}}>
                    <TouchableNativeFeedback onPress={()=>{console.log(victim)}}>
                        <View style={styles.userLocation2}>
                            <Image style={styles.userLocation}/>
                        </View>
                    </TouchableNativeFeedback>
                </Marker>

                    {
                        updateUserMarkers()
                    }



                {/*<Marker*/}
                {/*    coordinate={{*/}
                {/*        latitude:32.505008,longitude:-116.923947*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <View style={styles.otherHelperContainer}>*/}
                {/*        <Image style={styles.otherHelper} source={require('../../../assets/brad.jpg')}/>*/}
                {/*    </View>*/}
                {/*</Marker>*/}
                <Callout>
                    <MapModal
                        isVisible={isModalVisible}
                        user={focusedUser}
                        handleModalRejection={handleModalRejection}
                        handleModalAcceptance={handleModalAcceptance}
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


