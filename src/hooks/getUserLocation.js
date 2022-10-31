import * as Location from 'expo-location';

export const getUserLocation = async (setUserLocation) => {
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

    if(current.latitude && current.longitude){
        setUserLocation(current);
    }
}