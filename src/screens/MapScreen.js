import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import * as React from "react";
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from "react-native-maps";
import {useEffect, useRef, useState, useCallback} from "react";
import {fetchAllUsers} from "../hooks/fetchAllUsers";
import {OtherUserMarker} from "../components/OtherUserMarker";
import {MapModal} from "../components/MapModal";
import {RejectionMapModal} from "../components/RejectionMapModal";
import {fetchAllAlarms} from "../hooks/fetchAllAlarms";
import {acceptAlarm } from "../hooks/acceptAlarm";
import {rejectAlarm} from "../hooks/rejectAlarm";
import MapViewDirections from "react-native-maps-directions";
import {getPreciseDistance} from "geolib";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MapScreen(props){
    const [len, setLen] = useState('EN');
    AsyncStorage.getItem('len').then(res => {
         setLen(res)
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
    const [userLocation, setUserLocation] = useState({
        latitude:32.50605,longitude: -116.92371
    });
    const [reCenterVisible, setReCenterVisible] = useState(false);
    const navigation = useNavigation()

    const checkIfFocused = (coords, callback) => {
        map.current.getCamera().then(({ center }) => {
            const distance = getPreciseDistance(coords, center);
            const isFocusedOnCoords = distance < 100000;
            callback(isFocusedOnCoords);
        }).catch((error) => {
            callback(false);
        });
    };

    useEffect( ()=>{
        if(props.currentUser && !gotInfo){
            const focusedCoords = props.currentUser.coordinates;
            checkIfFocused(focusedCoords, (focused)=>{
                if(focused){
                    setGotInfo(true);
                }
            })
                const region = {
                    latitude: focusedCoords.latitude,
                    longitude: focusedCoords.longitude,
                    latitudeDelta: .05,
                    longitudeDelta: .05,
                };
                map.current.animateToRegion(region, 1000);
                setTimeout(()=>{setGotInfo(true)},7000);
        }
    })

    useEffect(() => {
        fetchAllAlarms(setAllAlarms,setAcceptedAlarm,setHelpingUser, setAskedForHelp, setCurrentUserAlarm);
        fetchAllUsers(setAllUsers);
    },[]);

    useEffect(()=>{
        if(!acceptedAlarm){
            setReCenterVisible(false);
        }
    },[acceptedAlarm]);

    const handleModalVisibility = ()=>{
        setIsModalVisible(!isModalVisible);
    }
    const handleRejectionModalVisibility = ()=>{
        setIsRejectionModalVisible(!isRejectionModalVisible);
    }
    const handleModalAcceptance = ()=>{
        handleModalVisibility();
        acceptAlarm(focusedUser, props.currentUser, len).then();
    }

    const cancelAcceptedAlarm = ()=>{
        setHelpingUser(false);
        setAcceptedAlarm(null);
        rejectAlarm(focusedUser).then();
        setIsRejectionModalVisible(false);
    }

    const handleMapPress = (event) =>{
        const userCoordinates = allUsers.map(user => user.coordinates)
        for(let i=0;i<userCoordinates.length;i++){
            if(userCoordinates[i].latitude === event.nativeEvent.coordinate.latitude
                && userCoordinates[i].longitude ===  event.nativeEvent.coordinate.longitude){
                return;
            }
        }
        props.setVisible(!props.visible);
    }

    const setUserVisibility = (user) => {
        if(!userIsInRadar(user)){
            return false;
        }
        if(!askedForHelp){
            if(helpingUser){
                return acceptedAlarm.alarmingUser === user.email ||
                    acceptedAlarm.users.includes(user.email)
            }
            return true;
        }
        return currentUserAlarm && currentUserAlarm.users.includes(user.email);

    }

    const centerMapOnCoords = (origin,destination) => {
        const edgePadding = 70
        map.current.fitToCoordinates([origin.coordinates,
            destination.coordinates],{
            edgePadding: {
                top: edgePadding,
                right: edgePadding,
                bottom: props.visible ? edgePadding+40 : edgePadding,
                left: edgePadding,
            },
        });
        setTimeout(()=>{
            setReCenterVisible(false);
        },1500)

    }

    const userIsInRadar = (otherUser)=>{
        const distance = getPreciseDistance(
            props.currentUser.coordinates,
            otherUser.coordinates
        );
        return  distance < props.currentUser.helpRadar && distance < otherUser.helpRadar;
    }

    const updateUserMarkers = ()=>{
        return allUsers.map((user,index) =>{
                return <OtherUserMarker
                    key={index}
                    visible={setUserVisibility(user)}
                    user={user}
                    victim={allAlarms.map((alarm)=>alarm.alarmingUser).includes(user.email)}
                    setFocusedUser={setFocusedUser}
                    handleModal={helpingUser ? handleRejectionModalVisibility : handleModalVisibility}
                />
            }
        )
    }

    const updateDirections = ()=>{
        return props.alarmingUser && <MapViewDirections
            origin={props.currentUser.coordinates}
            destination={props.alarmingUser.coordinates}
            apikey={process.env.GOOGLE_MAPS_KEY}
            strokeWidth={8}
            strokeColor="#914FFC"
            strokeColors={["#c39cff","#a75eff"]}
        />
    }

    const map = useRef();

    return(
        <View style={styles.container}>
            {   props.currentUser && props.currentUser.coordinates &&
                <MapView
                    ref={map}
                    style={styles.map}
                    initialRegion={
                            {
                                latitude:props.currentUser.coordinates.latitude,
                                longitude:props.currentUser.coordinates.longitude,
                                latitudeDelta:0.004,
                                longitudeDelta:0.004
                            }
                    }
                    onRegionChangeComplete={()=>setReCenterVisible(helpingUser)}
                    onPress={handleMapPress}
                    scrollEnabled={gotInfo}
                    // provider={PROVIDER_GOOGLE}
                >
                    <Marker coordinate={props.currentUser ? props.currentUser.coordinates : userLocation}>
                        <View style={[styles.userLocation2, {borderColor:askedForHelp?'rgba(98, 0, 255, 0.3)':'rgba(0, 66, 255, 0.3)' }]}>
                            <Image style={[styles.userLocation, {backgroundColor: askedForHelp? '#6540F5': '#0035f2'}]}/>
                        </View>
                    </Marker>

                    {
                        updateDirections()
                    }

                    {
                        updateUserMarkers()
                    }

                <Callout>
                    <MapModal
                        isVisible={isModalVisible}
                        user={focusedUser}
                        handleModalRejection={handleModalVisibility}
                        handleModalAcceptance={handleModalAcceptance}
                        loggedUser={props.currentUser}
                        len={len}
                    />
                    <RejectionMapModal
                        isVisible={isRejectionModalVisible}
                        user={focusedUser}
                        handleModal={()=>
                            setIsRejectionModalVisible(!isRejectionModalVisible)}
                        cancelAlarm={cancelAcceptedAlarm}
                        len={len}
                    />

                </Callout>
            </MapView>
            }
            <View style={[styles.buttonCallout,{
                // bottom:'13%'
                bottom: props.visible ? '13%' : '3%'
            }]}>
                {
                    reCenterVisible &&
                    <TouchableOpacity style={[styles.button]}
                                      onPress={()=>{centerMapOnCoords(props.currentUser,props.alarmingUser)
                                      }}>
                        <Ionicons name={'navigate-outline'}
                                  size={26}
                                  color={'black'}
                                  style={{marginTop: '-2%',
                                      marginRight: '2%'}}/>
                    </TouchableOpacity>
                }
                {
                    !props.visible &&
                    <TouchableOpacity style={[styles.button,
                        {backgroundColor: '#4F00F8'}]}
                                      onPress={()=>{navigation.navigate('AlertScreen')}}>
                        <Ionicons name={'alert-outline'}
                                  size={26}
                                  color={'white'}
                                  style={{marginTop: '-2%',
                                      marginRight: '2%'}}/>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        flexDirection:"row"
    },
    map:{
        width:'100%',
        height:'100%',
        flex:1
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
    },
    buttonCallout: {
        position: 'absolute',
        left:'82%',
        alignSelf:'flex-end',
        flexDirection:'column',
        justifyContent: 'space-between'
    },
    button: {
        marginVertical: 11,
        borderRadius: 50,
        height:60,
        width:60,
        backgroundColor: '#fff',
        alignItems: "center",
        justifyContent:'center',
        shadowOffset : { width: 1, height: 2},
        shadowOpacity:.7,
        elevation:1
    },
    text: {
        color: "black",
        fontWeight: "700",
        fontSize: 16,
    },
});

