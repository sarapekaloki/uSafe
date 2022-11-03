import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { auth } from "../../firebase";
import {getFirestore, collection, onSnapshot, doc} from 'firebase/firestore';
const screenWidth = Dimensions.get("screen").width;

//Alert button imports
import * as Haptics from 'expo-haptics';
import BottomSheet from "react-native-gesture-bottom-sheet";
import image1 from '../../assets/img/buttonUnpressed.png'
import image2 from '../../assets/img/buttonPressed2.png'

const OwnProfile = () => {

    const navigation = useNavigation()
    const currentEmail = auth.currentUser.email
    const firestore = getFirestore()
    const profilesRef = collection(firestore, "profiles")
    const [currentUsername, setCurrentUsername] = useState('')
    const [helpResponses, setHelpResponses] = useState('')
    const [profilePictureURL, setProfilePictureURL] = useState('')
    const [gotInfo, setGotInfo] = useState(false);

    const handleSignOut = () => {
        auth
        .signOut()
        .then(() => navigation.replace("Login"));
    };

    useEffect(() => {
        if(!gotInfo){
            getUserData()
            setGotInfo(true)
        }
    })

    const getUserData =  () => {
       onSnapshot(doc(firestore, "users2", currentEmail.toLowerCase()), (doc) => {
        if(doc.data()=== undefined) return;
        setCurrentUsername(doc.data().username)
        setHelpResponses(doc.data().helpResponses)
        setProfilePictureURL(doc.data().pictureUrl)
        });
    }


    const [image, set_image ] = useState(image1)
    const bottomSheet = useRef();
    function changeAlert(){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        set_image(image === image1 ? image2 : image1);}

    return (
       <View style= {styles.container}>
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

            <View style= {styles.profileDetails}>
                <Text style={styles.userNameText}> {currentUsername}</Text> 
                <Text style={styles.userEmailText}> {currentEmail}</Text>
                <Image style={styles.image} source={profilePictureURL!="" ? {uri: profilePictureURL} : require('../../assets/img/initial-profile-picture.jpeg')}></Image>
            </View>

            <View style= {styles.helpResponses}>
                <Image style={styles.HRIcon} source={require('../../assets/icons/helpResponsesIcon.png')}></Image>
                <Text style={styles.helpResponsesText}> Respuestas de ayuda: {helpResponses}</Text>
                
            </View>

            <TouchableOpacity
                style={styles.button}   
                onPress={handleSignOut}
            >
                <Text style={styles.buttonText}> Cerrar Sesión </Text>
            </TouchableOpacity>
       </View>

    )}

export default OwnProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: "5%",
        backgroundColor:'#D4B2EF',
        width: '90%',
        padding: 15,
        borderRadius: 10,
        elevation:10
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
        alignSelf:"center",
        width:'154%',
        height:'460%'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    profileDetails: {
        width: '90%',
        backgroundColor: '#fff',
        marginTop: "5%",
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation:10
    },
    userNameText:{
        fontSize: 20,
        fontWeight: '600',
        marginTop:'5%'
    },
    userEmailText:{
        color: '#A5A5A5'
    },
    image:{
        width: screenWidth / 3,
        height: screenWidth / 3,
        marginTop: '5%',
        marginBottom: '5%',
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
        alignItems: 'center',
        elevation:10
    },
    helpResponsesText:{
        fontSize: 15,
        fontWeight: '500',
        color: '#A5A5A5'
    },
    HRIcon:{
        width:30,
        height:30,
    }
})