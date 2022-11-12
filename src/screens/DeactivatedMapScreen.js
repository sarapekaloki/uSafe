import React, {Image, StyleSheet, Text, View} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";

export default function DeactivatedMapScreen(){

    const React = require('react-native');

    const {StyleSheet, PixelRatio} = React;

    let FONT_BACK_LABEL   = 22;

    if (PixelRatio.get() <= 2) {
        FONT_BACK_LABEL = 18;
    }

    return (
        <View style={{justifyContent:'center',alignItems:'center', backgroundColor:'rgb(200,200,200)'}}>
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../../assets/img/buttonUnavailable.png')}/>
                <View styles={styles.textContainer}>
                    <Text style={[styles.text,{fontSize:FONT_BACK_LABEL}]}>Para usar el mapa ve a las preferencias de
                        tu dispositivo y habilita la ubicación para la app. Recuerda que debes estar en CETYS para ver y utilizar el mapa</Text>
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
    logo:{
        marginTop:'-60%',
        width: 270,
        height: 270,
    },
    text:{
        marginTop:'10%',
        textAlign:'center',
        color:'white',
    },
    textContainer:{
        flex: 1,
        width:'100%',
    },
});
