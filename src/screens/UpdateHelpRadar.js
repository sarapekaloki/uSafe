import React, { useState } from "react";
import { Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase";
import NumericInput from 'react-native-numeric-input';
import {getFirestore, doc, updateDoc} from 'firebase/firestore';
import { UpdateHelpRadarWords } from "../lenguagesDicts/updateHelpRadarWords";
import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
  } from '@expo-google-fonts/open-sans';

const UpdateHelpRadar = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const firestore = getFirestore();
    const currentEmail = auth.currentUser.email;
    const userData = route.params.userData;
    const [radarValue, setRadarValue] = useState(userData.helpRadar)
    const len = userData.len;

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
      });

    const updatehelpRadar = () => {
        const newDoc = {
            coordinates: userData.coordinates,
            email: userData.email,
            helpResponses: userData.helpResponses,
            pictureUrl: userData.pictureUrl,
            username: userData.username,
            token: userData.token,
            len: userData.len,
            helpRadar: radarValue,
            likes:userData.likes,
            reportedBy:userData.reportedBy,
            reported:userData.reported
        };

        const docRef = doc(firestore, "users", currentEmail);
        updateDoc(docRef, newDoc).then(() => {
            navigation.goBack();
    }); 
    }  
    
    if (!fontsLoaded) {
        return null;
    }

    return(
        <View style={styles.usernameModalContainer}>
            <View style = {styles.header}>
                <Image style = {styles.headerImg} source={require('../../assets/img/clearLogo.png')}></Image>
            </View>
            <View style={styles.sectionTitle}>
                    <Entypo name="chevron-left" size={28} color="black" />
                <Text style={styles.sectionTitleText}>{UpdateHelpRadarWords[len].title}</Text>
            </View>
            <Text style={styles.description}>{UpdateHelpRadarWords[len].description}</Text>

            <NumericInput 
                type='plus-minus'
                value={radarValue}
                onChange={value => setRadarValue(value)}
                minValue={100}
                maxValue={1500}
                step={100}
                editable={false}
                rounded
                iconStyle={{ color: 'white' }} 
                leftButtonBackgroundColor={"#9B71FF"}
                rightButtonBackgroundColor={"#4C11CB"}
                separatorWidth={0}
                containerStyle={{backgroundColor: '#FFF', alignSelf: 'center', bottom:'30%', width:'80%', backgroundColor: "#F3F3F3"}}
                inputStyle={{fontFamily: 'Spartan_500Medium', fontSize: 31}}
                totalWidth={250}
                totalHeight={130}
                borderColor={"#FFF"}
            />
         
            <TouchableOpacity 
                    style = {radarValue == userData.helpRadar? styles.disabledButton :styles.confirmButton} 
                    disabled={radarValue == userData.helpRadar? true: false}
                    onPress={updatehelpRadar}>
                    <Text style={styles.buttonText} >{UpdateHelpRadarWords[len].button}</Text>
                </TouchableOpacity>
        </View>

    )
}

export default UpdateHelpRadar

const styles = StyleSheet.create({
    usernameModalContainer: {
        flex: 1,
        backgroundColor: '#FFF',
        alignItems: 'center',
    },
    header: {
        width: '20%',
        marginTop: '10%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerImg: {
        width:150,
        height: 60
    },
    sectionTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width:'100%',
        marginTop: 20
    },  
    sectionTitleText: {
        marginLeft: 10,
        fontFamily:'OpenSans_500Medium',
        fontSize: 15,
    },
    description: {
        fontFamily: 'OpenSans_400Regular',
        'color': '#5D5D5D',
        fontSize: 14,
        marginLeft: 35,
        marginRight: 30,
        textAlign: 'justify',
        marginTop: 10,
        marginBottom: 150
    }, 
    disabledButton:{
        bottom: 60,
        width:'60%',
        height: 45,
        borderRadius:20,
        justifyContent: "center",
        alignItems:'center',
        backgroundColor:'#CACACA'
        
    },
    confirmButton:{
        bottom: 60,
        width:'60%',
        height: 45,
        borderRadius:20,
        justifyContent: "center",
        alignItems:'center',
        backgroundColor:'#4C11CB'
        
    },
    buttonText: {
        fontFamily:'OpenSans_400Regular',
        fontSize: 15,
        color: 'white' 
    }
})