import React, {useState, useEffect} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { notificationsWords } from "../lenguagesDicts/notificationsWords";
import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import {
    StyleSheet,
    View,
    Image,
    Text,
    ScrollView
} from "react-native";
import {
    useFonts,
    Spartan_400Regular,
    Spartan_500Medium,
    Spartan_600SemiBold
  } from '@expo-google-fonts/spartan';

export default function Notifications (props){
    const [len, setLen] = useState('EN');
    const notifications = props.notifications    

    const noNotif = notifications.length>0 ? false : true;


    AsyncStorage.getItem('len').then(res => {
        setLen(res)
   });

   let [fontsLoaded] = useFonts({
        Spartan_400Regular,
        Spartan_500Medium,
        Spartan_600SemiBold
    });

     const getTimePassed = (time) => {
        const date1 = time.toDate()
        const date2 = new Date();

        const deltaSeconds = Math.floor((date2 - date1) / 1000);

        if(deltaSeconds < 60){
            return "Just now"
        } else if (deltaSeconds < 3600) {
            const mins = Math.floor(deltaSeconds/60)
            return mins+"m"
        } else if (deltaSeconds < 86400) {
            const hours = Math.floor(deltaSeconds/3600)
            return hours+"h"
        } else if (deltaSeconds < 604800) {
            const days = Math.floor(deltaSeconds/86400)
            return days+"d"
        } else {
            return date1.toLocaleDateString('en-GB')
        
     }}

    if (!fontsLoaded) {
        return null;
    }

    if(noNotif){
        return (  
            <View style={styles.container}>
                <Image style={styles.img} source={require('../../assets/img/bell.png')}></Image>
                <Text style={styles.text}>{notificationsWords[len].noNotifications}</Text>          
            </View>
        )
    }
    const renderNotifications = ()=>{
        const elements = notificationsWords[len].elements
        
        return notifications.slice(0).reverse().map((element, key) => {
            const time = getTimePassed(element.time)
            const color = elements[element.type].color
            const icon = elements[element.type].icon
            const title = elements[element.type].title
            const description = element.user + elements[element.type].description


            return (
                <View style={styles.notification} key={key}>
                    <View style={[styles.icon, {backgroundColor: color}]}>
                    <FontAwesome5 name={icon} size={24} color="white" />
                    </View>
                    <View>
                        <Text style={styles.notificationTitle}>{title}</Text>
                        <Text style={styles.notificationDescription}>{description}</Text>
                        <Text style={styles.time}>{time}</Text>
                    </View>
                </View>
            )
        });
    }

  

    return(
        
        <ScrollView style={styles.container}>
            {renderNotifications()}
        </ScrollView>
        
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        width: "100%",
        height: "100%"
    },
    img: {
        width: 250,
        height: 250,
        alignSelf: "center",
        marginTop: 50
    },
    text: {
        fontFamily: 'Spartan_600SemiBold',
        fontSize: 18,
        alignSelf: "center"
    },
    notification: {
        display: "flex",
        flexDirection: "row",
        width: '90%',
        height: 85,
        borderBottomWidth: 0.7,
        borderBottomColor: '#D6D6D6',
        alignSelf: "center",
    },
    icon: {
        width: 60,
        height: 60,
        borderRadius: 60,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 20
    },
    notificationTitle: {
        fontFamily: 'Spartan_600SemiBold',
        fontSize: 15,
        marginTop: 20
    },
    notificationDescription: {
        fontFamily: 'Spartan_400Regular',
        fontSize: 14,
        marginTop: 7
    },
    time:{
        fontFamily: 'Spartan_400Regular',
        fontSize: 10,
        marginTop: 10,
        color: "#BABABA"


    }

})
