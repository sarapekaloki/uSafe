import React from "react";
import {StyleSheet, View, Text, Button, Image} from "react-native";
import {Marker} from "react-native-maps";

export const OtherUserMarker = ({
                          coordinates,
                          src
                      }) => {
    return (
        <Marker
            coordinate={coordinates}
        >
            <View style={styles.container}>
                <Image style={styles.image} source={src}/>
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    image:{
        width: 35,
        height: 35,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    container:{
        borderColor: 'rgba(71, 106, 232, .5)',
        borderWidth: 6,
        borderRadius: 100,
    },
})

