import React, {useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { auth } from "../../../firebase";
import {getFirestore, doc, updateDoc} from 'firebase/firestore';
import { Dropdown } from 'react-native-element-dropdown';

import {
    useFonts,
    Spartan_800ExtraBold,
    Spartan_700Bold,
    Spartan_500Medium
  } from '@expo-google-fonts/spartan';



const LenguageSelection = () => {
    const [lenValue, setLenValue] = useState('')
    const navigation = useNavigation();
    const route = useRoute();
    const userData = route.params.userData;
    const firestore = getFirestore();
    const currentEmail = auth.currentUser.email;


    let [fontsLoaded] = useFonts({
        Spartan_800ExtraBold,
        Spartan_700Bold,
        Spartan_500Medium
      });

      const setLenguage = () => {
        const newDoc = {
            coordinates: userData.coordinates,
            email: userData.email,
            helpResponses: userData.helpResponses,
            pictureUrl: userData.pictureUrl,
            username: userData.username,
            token: userData.token,
            len: lenValue,
            helpRadar: userData.helpRadar
        };

        const docRef = doc(firestore, "users2", currentEmail);
        updateDoc(docRef, newDoc).then(() => {
            navigation.navigate("HelpRadarSetUp", {userData: newDoc});
        });       
        
    };
  

    if (!fontsLoaded) {
        return null;
    }

    return(
       <View style = {styles.container}>
            <Image style={styles.earthPhoto} source={require('../../../assets/img/earth.png')}></Image>
            <Text style={styles.header}>Seleccionar lenguaje de preferencia</Text>
            <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                containerStyle={styles.containerStyle}
                placeholder= {lenValue==""? "Seleccionar lenguaje: ": lenValue}
                data={[{label: 'Español', value: 'ES'}, {label: 'English', value: 'EN'} ]}
                maxHeight={300}
                labelField="label"
                valueField="value"
                onChange={element => setLenValue(element.label)}
                activeColor={'#E5E5E5'}
            >
            </Dropdown>
            <TouchableOpacity style = {lenValue==""? styles.disabledButton: styles.button} onPress={() => setLenguage()} disabled={lenValue==""}>
                <Text style={styles.buttonText}>
                    Confirmar y continuar
                </Text>
                <Entypo style = {styles.icon2} name="chevron-thin-right" size={24} color="white" />
            </TouchableOpacity>
        </View>
    )
}

export default LenguageSelection

const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: '100%',
        backgroundColor: '#9664FF'
    },
    earthPhoto: {
        alignSelf:'center',
        marginTop: 50,
        width: 220,
        height: 220
    },
    header: {
        fontFamily:'Spartan_700Bold',
        fontSize:30,
        textAlign:'center',
        color:'#FFF',
    },
    dropdown: {
        height: 50,
        marginTop: 50,
        alignSelf: "center",
        width: 300,
        borderColor: 'gray',
        backgroundColor: '#FFF',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    placeholderStyle : {
        fontFamily: 'Spartan_500Medium',
        fontSize: 16
    },
    containerStyle: {
        fontFamily: 'Spartan_500Medium',
        fontSize: 16,
        borderRadius: 10
    },
    button: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        borderRadius: 30,
        top: 150,
        width: '80%',
        height: 50,
        alignSelf: 'center',
        backgroundColor: '#FF66C4'
    }, 
    disabledButton: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        borderRadius: 30,
        top: 150,
        width: '80%',
        height: 50,
        alignSelf: 'center',
        backgroundColor: '#B1B1B1'
    }, 
    buttonText: {
        fontFamily: 'Spartan_500Medium',
        fontSize: 15,
        color: '#FFF',
        marginLeft: 15
    },
    icon2: {
        marginRight: 10
    }

})