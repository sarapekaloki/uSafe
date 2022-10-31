import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import * as React from "react";
import MapView, {Callout, Marker} from "react-native-maps";
import {useEffect, useRef, useState} from "react";
import { firebaseConfig} from "../../../firebase";
import firebase from 'firebase/compat/app';
import {getCurrentUser} from "../../hooks/getCurrentUser";
import {updateUserLocation} from "../../hooks/updateUserLocation";
import {fetchAllUsers} from "../../hooks/fetchAllUsers";
import { getFirestore, collection, getDocs, doc, updateDoc} from "firebase/firestore";
import {OtherUserMarker} from "../../components/OtherUserMarker";
import {MapModal} from "../../components/MapModal";
import {Button} from "../../components/Button";


export default function MapScreen({navigation}){
    firebase.initializeApp(firebaseConfig);
    const db = getFirestore();
    const usersRef = collection(db, "users2");

    const [currentUser, setCurrentUser] = useState(null);
    const [userLocation, setUserLocation] = useState({
        latitude:32.505008,longitude:-116.923947
    });

    const [allUsers, setAllUsers] = useState([
        {coordinates:{latitude:0,longitude:0},
        src:require('../../../assets/brad.jpg')
        }
    ]);
    const [userMarkers, setUserMarkers] = useState([]);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(()=>{
        // if(isFirstLoad){
        //     updateUserMarkers();
        //     console.log(userMarkers.length);
        //     setIsFirstLoad(false);
        // }
        // if(!currentUser){
        //     getCurrentUser(setCurrentUser, setUserLocation);
        //     fetchAllUsers(setAllUsers).then();
        // }
        // else{
        //     setTimeout(setCurrentUserLocation, 3000);
        // }

    });

    const setCurrentUserLocation = ()=> {
        updateUserLocation(
            userLocation,
            setUserLocation,
            '6j0y2l0V3wQvzZtG53v8',
            currentUser
        );
    }


    const updateUserMarkers = ()=>{
        setUserMarkers(allUsers.map(user=>
            <OtherUserMarker
                key={user.email+user.username}
                coordinates={user.coordinates}
                src={require('../../../assets/brad.jpg')}/>

        ))
    }

    const handleModal = ()=>{
        setIsModalVisible(!isModalVisible);
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
                    <TouchableOpacity onPress={handleModal}>
                        <View style={styles.userLocation2}>
                            <Image style={styles.userLocation}/>
                        </View>
                    </TouchableOpacity>
                </Marker>


                {/*<OtherUserMarker*/}
                {/*    key={'regrsdf'}*/}
                {/*    coordinates={{*/}
                {/*        latitude:0,longitude:0*/}
                {/*    }}*/}
                {/*    src={require('../../../assets/icon.png')}/>*/}

                <View>
                    {
                        userMarkers
                    }
                </View>



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
                    <MapModal isVisible={isModalVisible} handleModal={handleModal}/>
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
    otherHelper:{
        width: 35,
        height: 35,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    otherHelperContainer:{
        borderColor: 'rgba(71, 106, 232, .5)',
        borderWidth: 6,
        borderRadius: 100,
    },
    victim:{
        width: 60,
        height: 60,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    victimContainer:{
        borderColor: 'rgba(229, 67, 67, .5)',
        borderWidth: 12,
        borderRadius: 100,
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


