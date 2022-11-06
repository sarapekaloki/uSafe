import * as React from 'react';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import image1 from '../../../assets/img/buttonUnpressed.png'
import image2 from '../../../assets/img/buttonPressed2.png'


const AlertScreen = () =>{
    // const sleep = ms => new Promise(
    //     resolve => setTimeout(resolve,ms)
    // )

    const light = "light"
    const dark = "dark"
    const modoNoAlerta = "Iniciar Modo Alerta!"
    const modoAlerta = "Terminar Modo Alerta?"
    const [ theme , set_theme ] = useState(light);
    const [ message, set_message ] = useState(modoNoAlerta);
    const [image, set_image ] = useState(image1);

    async function changeAlert(){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        set_image(image === image1 ? image2 : image1);
        set_message(message === modoNoAlerta ? modoAlerta : modoNoAlerta);
        // await sleep(5000);
    }

    return(
        <View style={styles.modal}>
            <TouchableOpacity
                style={styles.button2}
                onPressOut={() => changeAlert()}
            >
                <Image source={image} style={styles.buttonImage}/>
            </TouchableOpacity>
            <Text style={styles.message}>
                {message}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    message:{
        color: "#28194C",
        fontSize: 30,
        fontWeight: "bold",
        top: 110,
        alignSelf: "center"
    },
    modal:{
        backgroundColor: '#D4B2EF',
        flex:1,
    },
    button: {
        height: 50,
        width: 150,
        backgroundColor: "#28194C",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        shadowColor: "#D4B2EF",
        shadowOpacity: 0.7,
        shadowOffset: {
            height: 4,
            width: 4,
        },
        shadowRadius: 5,
        elevation: 6,
    },
    button2:{
        height: 50,
        width: 150,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        marginTop: 240,
        marginLeft:'31%'
    },
    buttonImage:{
        width:'154%',
        height:'460%'
    },
    text: {
        color: "white",
        fontWeight: "600",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

});

export default AlertScreen;
