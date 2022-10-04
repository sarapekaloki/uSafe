import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase";
import {getFirestore, collection, getDocs} from 'firebase/firestore';
// import {storage} from '@react-native-firebase/storage';

const OwnProfile = () => {
    const navigation = useNavigation()
    const currentEmail = auth.currentUser.email
    const firestore = getFirestore()
    const profilesRef = collection(firestore, "profiles")
    const [currentUsername, setCurrentUsername] = useState('')
    const [helpResponses, setHelpResponses] = useState('')
    const [profilePicture, setProfilePicture] = useState('')
    const [profilePictureURL, setProfilePictureURL] = useState('')

    const handleSignOut = () => {
        auth
        .signOut()
        .then(() => navigation.replace("Login"));
    };

    useEffect(() => {
        getUserData()
    })

    const getUserData = async () => {
        await getDocs(profilesRef).then((res) => {
            res.forEach((doc) => {
                if((doc.data().email).toLowerCase() == currentEmail){
                    setCurrentUsername(doc.data().username);
                    setHelpResponses(doc.data().helpResponses);
                    setProfilePicture(doc.data().profilePicture);
                } 
            })
        })
    }

    const getProfilePictureFromStorage = () => {
        storage().ref(profilePicture)
        // .ref(profilePicture).getDownloadUrl().then((url) => {
        //     setProfilePictureURL(url)
        // })
        // console.log(profilePictureURL)
    }



    return(
       <View style= {styles.container}>
            <View style= {styles.profileDetails}>
                <Text style={styles.userNameText}> {currentUsername}
                    <TouchableOpacity onPress={()=> navigation.replace("Configuración")}>
                        <Image style={styles.settingsIcon} source={require('../../assets/icons/settingsIcon.png')}></Image>

                    </TouchableOpacity>

                </Text> 
                <Text style={styles.userEmailText}> {currentEmail}</Text>
                    

                <Image style={styles.image} source={require('../../assets/img/initial-profile-picture.jpeg')}></Image>

    
                
            </View>
            <View style= {styles.helpResponses}>
                <Image style={styles.HPIcon} source={require('../../assets/icons/helpResponsesIcon.png')}></Image>
                <Text style={styles.helpResponsesText}> Respuestas de ayuda: {helpResponses}</Text>
                
            </View>

            <TouchableOpacity
                style={styles.button}   
                onPress={handleSignOut}
            >
                <Text style={styles.buttonText}> Cerrar Sesión </Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
                style={styles.button}   
                onPress={getProfilePictureFromStorage}
            >
                <Text style={styles.buttonText}> dame username </Text>
            </TouchableOpacity> */}
       </View>
    )
}

export default OwnProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
        backgroundColor:'#533795',
        width: '90%',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    profileDetails: {
        width: '90%',
        height: '30%',
        backgroundColor: '#fff',
        marginTop: -300,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    userNameText:{
        fontSize: 20,
        fontWeight: '600',
        left:10

    },
    userEmailText:{
        color: '#A5A5A5'
    },
    image:{
        width: '40%',
        height: '60%',
        marginTop: 15,
        borderRadius: 60  
    },
    helpResponses:{
        flexDirection: "row",
        width: '90%',
        height: '10%',
        backgroundColor: '#fff',
        borderRadius: 15,
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    helpResponsesText:{
        fontSize: 15,
        fontWeight: '500',
        color: '#A5A5A5'
    },
    HPIcon:{
        width:30,
        height:30
    },
 
    settingsIcon:{
        width:30,
        height:30,

    },

})