import * as React from 'react';
import * as Haptics from 'expo-haptics';
import {useRef, useState} from "react";
import { SafeAreaView, View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import BottomSheet from "react-native-gesture-bottom-sheet";
import image1 from '../../../assets/img/buttonUnpressed.png'
import image2 from '../../../assets/img/buttonPressed.png'

const AlertScreen = () => {
    const [image, set_image ] = useState(image1)

    // let alertModeActive = false
    // const a = require('../../../assets/img/buttonUnpressed.png')
    // const b = require('../../../assets/img/buttonPressed.png')
    const bottomSheet = useRef();
    function changeAlert(){
        // alertModeActive = !alertModeActive
        // set_image(alertModeActive ? image2 : image1)
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        set_image(image === image1 ? image2 : image1)
    }

    return (
        <SafeAreaView style={styles.container}>
            <BottomSheet hasDraggableIcon ref={bottomSheet} height={600} sheetBackgroundColor={"#D4B2EF"}>
                <View>
                    <TouchableOpacity
                        style={styles.button2}
                        onPress={() => changeAlert()}
                        >
                        <Image source={image} style={styles.buttonImage}/>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
            <TouchableOpacity
                style={styles.button}
                onPressIn={() => bottomSheet.current.show()}
            >
                <Text style={styles.text}>Open modal</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
        width:200,
        height:200
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


