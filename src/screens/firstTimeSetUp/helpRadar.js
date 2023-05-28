import React, {useState} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View} from "react-native";
import { Entypo } from '@expo/vector-icons';
import { auth } from "../../../firebase";
import {getFirestore, doc, updateDoc} from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import NumericInput from 'react-native-numeric-input';
import { helpRadarWords } from "../../lenguagesDicts/helpRadarWords";

import {
    useFonts,
    Spartan_800ExtraBold,
    Spartan_700Bold,
    Spartan_500Medium
  } from '@expo-google-fonts/spartan';

const HelpRadarSetUp = () => {
    const [radarValue, setRadarValue] = useState(100)
    const navigation = useNavigation()
    const route = useRoute();
    const firestore = getFirestore();
    const currentEmail = auth.currentUser.email;
    const userData = route.params.userData;
    const len = userData.len;
    let [fontsLoaded] = useFonts({
        Spartan_800ExtraBold,
        Spartan_700Bold,
        Spartan_500Medium
      });

      const setHelpRadar = () => {
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
            navigation.navigate("Tabs", {len: len});
        });       
        
    };

    if (!fontsLoaded) {
        return null;
    }

    return(
       <View style = {styles.container}>
        <Text style = {[styles.title,{left: len == 'EN'? '46%': '40%'}]}>
            {helpRadarWords[len].title}
        </Text>
        <Text style = {styles.descriptionText}>
            {helpRadarWords[len].description}
        </Text>
        <MaterialCommunityIcons style={styles.icon} name="radar" size={300} color="#C1A7FF" />    
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
            leftButtonBackgroundColor={"#F18CE7"}
            rightButtonBackgroundColor={"#FF66C4"}
            separatorWidth={0}
            containerStyle={{backgroundColor: '#FFF', alignSelf: 'center', bottom:'30%', width:'80%'}}
            inputStyle={{fontFamily: 'Spartan_500Medium', fontSize: 31}}
            totalWidth={250}
            totalHeight={130}
            borderColor={"#9664FF"}
        />
           <TouchableOpacity style = {styles.button} onPress={() => setHelpRadar()}>
            <Text style={styles.buttonText}>
                {helpRadarWords[len].button}
            </Text>
            <Entypo style = {styles.icon2} name="chevron-thin-right" size={24} color="white" />
        </TouchableOpacity>
    </View>
    )
}

export default HelpRadarSetUp

const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: '100%',
        backgroundColor: '#9664FF'
    },
    title : {
        color: "#FFF",
        fontFamily: 'Spartan_700Bold',
        fontSize: 25,
        top: '9%',
        marginBottom: 10
    },
    descriptionText: {
        color: "#FFF",
        fontFamily: 'Spartan_500Medium',
        fontSize: 17,
        top: '9%',
        alignSelf: 'flex-end',
        paddingLeft: 160,
        paddingRight: 5
    },
    icon:{
        right: '34%',
        bottom: '18%'
    },
    numberPicker: {
        width:200,
        height: 100,
        top: 50,
        color: 'blue'
    },
    button: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        borderRadius: 30,
        bottom:50,
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
    icon2: {
        marginRight: 10
    }

})