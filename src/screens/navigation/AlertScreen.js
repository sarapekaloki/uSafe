import * as React from 'react';
import { useState, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import BottomSheet from "react-native-gesture-bottom-sheet";
//Alert button imports
import * as Haptics from 'expo-haptics';
import image1 from '../../../assets/img/buttonUnpressed.png'
import image2 from '../../../assets/img/buttonPressed2.png'

export default function AlertScreen({navigation}){
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
