import { StatusBar } from 'expo-status-bar';
import {Image, StyleSheet, Text, View} from 'react-native';
import * as React from "react";
import * as Location from 'expo-location';
import MapView, {Marker, Polyline} from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import { GOOGLE_MAPS_KEY } from '@env';
import {useRef} from "react";

const brad = require('./assets/brad.png');
const queen = require('./assets/queen.png');


export default function App() {

    const [view_origin, setViewOrigin] = React.useState({
        latitude:32.507504,
        longitude:-116.923159
    })
    const [queen_origin, setQueenOrigin] = React.useState({
        latitude:32.507504,
        longitude:-116.923159
    })
    const [brad_origin, setBradOrigin] = React.useState({
        latitude:32.505242,
        longitude:-116.923191
    })
    const [origin, setOrigin] = React.useState({
        latitude:32.523016,
        longitude:-117.032167
    })

    const map_limits = {
        left:32.506839,
    }
    const map = useRef(null);

    function checkMapLimit(region){
        // this.setMapBoundaries(
        //     {latitude:32.508134, longitude:-116.925772},
        //     {latitude:32.505288, longitude:-116.922362}
        //     )
        // if(region.longitude <-116.925784){
        //     region.longitude =-116.925784
        // }
        // if(region.longitude >  -116.922332){
        //     region.longitude =  -116.922332
        // }
        // if(region.latitude < 32.504747){
        //     region.latitude = 32.504747
        // }
        // if(region.latitude > 32.508144){
        //     region.latitude = 32.508144
        // }

        if(region.longitude <-116.925784 || region.longitude >  -116.922332 ||
            region.latitude < 32.504747 || region.latitude > 32.508144){
            // console.log("Out of bounds");
            // this.map.animateToRegion({
            //     latitude:queen_origin.latitude,
            //     longitude:queen_origin.longitude,
            //     latitudeDelta:0.09,
            //     longitudeDelta:0.04
            // })
        }
    }

    React.useEffect(()=> {
        getLocationPermission();
    }, [])

    async function getLocationPermission() {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if(status !== 'granted'){
            alert('Permission denied');
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        const current = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude
        }

        setOrigin(current);
    }
    return (
        <View style={styles.container}>
            <MapView
                ref={map}
                style={styles.map}
                region={{
                    latitude:queen_origin.latitude,
                    longitude:queen_origin.longitude,
                    latitudeDelta:0.09,
                    longitudeDelta:0.04
                }}
                minZoomLevel={17}
                maxZoomLevel={30}
                onRegionChange={checkMapLimit}
                // onRegionChange={checkMapLimit}

            >
                <Marker
                    draggable
                    coordinate={brad_origin}
                    onDragEnd={(direction) =>
                        setBradOrigin(direction.nativeEvent.coordinate)}
                >
                    <View style={styles.otherHelperContainer}>
                        <Image style={styles.otherHelper} source={require('./assets/brad.png')}/>
                    </View>
                </Marker>
                <Marker
                    draggable
                    coordinate={queen_origin}
                    onDragEnd={(direction) =>
                        setQueenOrigin(direction.nativeEvent.coordinate)}
                >
                    <View style={styles.victimContainer}>
                        <Image style={styles.victim} source={require('./assets/queen.png')}/>
                    </View>
                </Marker>
                <Marker
                    draggable
                    coordinate={origin}
                    onDragEnd={(direction) =>
                        setOrigin(direction.nativeEvent)}
                >
                    <View style={styles.userLocation2}>
                        <Image style={styles.userLocation}/>
                    </View>
                </Marker>

                <MapViewDirections
                    origin={queen_origin}
                    destination={origin}
                    apikey={GOOGLE_MAPS_KEY}
                    strokeColor="#D4B2EF"
                    strokeWidth={6}
                />
            </MapView>
        </View>
    );
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
    },
    userLocation2:{
        borderWidth: 28,
        borderRadius: 100,
        borderColor: 'rgba(101, 64, 245, .3)',
    }
});




















