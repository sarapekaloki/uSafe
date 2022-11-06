import * as React from 'react';
import { useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import BottomSheet from "react-native-gesture-bottom-sheet";
//Alert button imports
import * as Haptics from 'expo-haptics';
import image1 from '../../../assets/img/buttonUnpressed.png'
import image2 from '../../../assets/img/buttonPressed2.png'

export default function AlertScreen({navigation}){
    const [image, set_image ] = useState(image1)
    const bottomSheet = useRef();
    function changeAlert(){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        set_image(image === image1 ? image2 : image1);}

    return(
        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <BottomSheet hasDraggableIcon ref={bottomSheet} height={600} sheetBackgroundColor={"#D4B2EF"}>
                <View>
                    <TouchableOpacity
                        style={styles.button2}
                        onPressIn={() => changeAlert()}
                    >
                        <Image source={image} style={styles.buttonImage}/>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </View>
    )
}

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
