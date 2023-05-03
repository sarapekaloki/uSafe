import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from '@expo/vector-icons';

import {
    useFonts,
    Spartan_800ExtraBold,
    Spartan_500Medium
  } from '@expo-google-fonts/spartan';


const Main = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const userData = route.params.userData;

    let [fontsLoaded] = useFonts({
        Spartan_800ExtraBold,
        Spartan_500Medium
      });

  

    if (!fontsLoaded) {
        return null;
    }

    return(
       <View style = {styles.container}>
        <Text style = {styles.text}>
            Prevén situaciones de riesgo con
        </Text>
        <Image style ={styles.logo} source={require('../../../assets/img/logo3.png')}></Image>
        <Image style ={styles.phoneGirl} source={require('../../../assets/img/phone-girl.png')}></Image>
        <TouchableOpacity style = {styles.button} onPress={() => {navigation.navigate("LenguageSelection", {userData: userData})}}>
            <Text style={styles.buttonText}>
                Configurar cuenta
            </Text>
            <Entypo style = {styles.icon} name="chevron-thin-right" size={24} color="white" />
        </TouchableOpacity>
       </View>
    )
}

export default Main

const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: '100%',
        backgroundColor: '#9664FF'
    },
    text: {
        color: "#FFF",
        fontFamily: 'Spartan_800ExtraBold',
        fontSize: 35,
        top:'10%',
        paddingLeft: 30,
        paddingRight: 20,
        marginBottom: 110
    },
    logo : {
        width:180,
        height:60,
        marginLeft: 20,
        marginBottom: 50
    }, 
    phoneGirl: {
        width: 250,
        height: 250,
        alignSelf: 'center'

    },
    button: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        marginTop: 40,
        borderRadius: 30,
        width: '80%',
        height: 50,
        alignSelf: 'center',
        backgroundColor: '#FF66C4'
    }, 
    buttonText: {
        fontFamily: 'Spartan_500Medium',
        fontSize: 15,
        color: '#FFF',
        marginLeft: 15
    },
    icon: {
        marginRight: 10
    }
})