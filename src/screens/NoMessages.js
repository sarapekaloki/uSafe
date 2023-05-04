import React, {Image, StyleSheet, Text, View} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function NoMessages(){

    const React = require('react-native');

    const {StyleSheet, PixelRatio} = React;

    let FONT_BACK_LABEL   = 22;

    if (PixelRatio.get() <= 2) {
        FONT_BACK_LABEL = 18;
    }

    return (
        <View style={{justifyContent:'center',alignItems:'center', backgroundColor:'rgb(200,200,200)'}}>
            <View style={styles.container}>
                <View styles={styles.textContainer}>
                    <Text style={[styles.text,{fontSize:FONT_BACK_LABEL}]}>Aun no eres parte de un grupo de ayuda.
                    Podrás acceder a los mensajes una vez que aceptes una alarma, o pidas una.</Text>
                </View>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    container:{
        width: '80%',
        height: '100%',
        backgroundColor: 'rgb(200,200,200)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text:{
        justifyContent: 'center',
        textAlign:'center',
        color:'white',
    },
    textContainer:{
        flex: 1,
        width:'100%',
    },
});
