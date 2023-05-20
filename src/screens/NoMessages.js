import React, {Image, StyleSheet, Text, View} from 'react-native';
import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
} from '@expo-google-fonts/open-sans';

export default function NoMessages(){

    const React = require('react-native');

    const {StyleSheet, PixelRatio} = React;

    let FONT_BACK_LABEL   = 22;

    if (PixelRatio.get() <= 2) {
        FONT_BACK_LABEL = 18;
    }

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
    });

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={{justifyContent:'center',alignItems:'center', backgroundColor:'white'}}>
            <View style={styles.container}>
                <Image style={styles.logo} source={require('../../assets/img/no-messages.png')}/>
                <View styles={styles.textContainer}>
                    <Text style={styles.header}>
                        No hay mensajes disponibles
                    </Text>
                    <Text style={styles.text}>
                        Sólo disponible para aquellos que pidieron ayuda, o están en proceso de ayudar a alguien más
                    </Text>
                </View>
            </View>
        </View>

    );
}
const styles = StyleSheet.create({
    container:{
        width: '80%',
        height: '100%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo:{
        marginTop:-100,
        width: 270,
        height: 270,
    },
    header:{
        marginTop:'10%',
        textAlign:'center',
        fontFamily: 'Spartan_700Bold',
        fontSize:22,
    },
    text:{
        marginTop:'10%',
        textAlign:'center',
        fontFamily: 'Spartan_700Bold',
        fontSize:15,
        opacity:.6,
    },
    textContainer:{
        flex: 1,
        width:'100%',
    },
});
