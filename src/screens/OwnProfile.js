import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { auth } from "../../firebase";
import {getFirestore, collection, onSnapshot, doc} from 'firebase/firestore';
const screenWidth = Dimensions.get("screen").width;
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 

//Alert button imports
import * as Haptics from 'expo-haptics';
import BottomSheet from "react-native-gesture-bottom-sheet";
import image1 from '../../assets/img/buttonUnpressed.png'
import image2 from '../../assets/img/buttonPressed2.png'
import { setData } from "./LoginScreen";
import {
    useFonts,
    Spartan_500Medium,
    Spartan_400Regular,
    Spartan_600SemiBold
  } from '@expo-google-fonts/spartan';

const OwnProfile = () => {

    const navigation = useNavigation()
    const currentEmail = auth.currentUser.email
    const firestore = getFirestore()
    const profilesRef = collection(firestore, "profiles")
    const [currentUsername, setCurrentUsername] = useState('')
    const [helpResponses, setHelpResponses] = useState('')
    const [profilePictureURL, setProfilePictureURL] = useState('')
    const [gotInfo, setGotInfo] = useState(false);


    const handleSignOut =async  () => {
        await setData("userCredentials", null);
        auth
        .signOut()
        .then(() => navigation.replace("Login"));
    };
    let [fontsLoaded] = useFonts({
        Spartan_500Medium,
        Spartan_400Regular,
        Spartan_600SemiBold
    });

    useEffect(() => {
        if(!gotInfo){
            getUserData()
            setGotInfo(true)
        }
    })

    const getUserData =  () => {
       onSnapshot(doc(firestore, "users", currentEmail.toLowerCase()), (doc) => {
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


    if (!fontsLoaded) {
        return null;
    }

    return (
       <View style= {styles.container}>
            <View style={styles.purpleTop}>
                <Image style={styles.image} source={profilePictureURL!="" ? {uri: profilePictureURL} : require('../../assets/img/initial-profile-picture.jpeg')}></Image>
            </View>
            <View style={styles.profileDetails}>
                <View style={styles.pdFirstRow}>
                    <Text style={styles.userNameText}> {currentUsername}</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                        <Feather name="edit" size={24} color="#8F8F8F" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.userEmailText}> {currentEmail}</Text>
            </View>
            <View style ={styles.extraInfo}>
                <View style = {styles.column}>
                    <Text style={styles.extraInfoHeader}>Likes</Text>
                    <Text style={styles.extraInfoNum}>0</Text>
                </View>
                <View style = {styles.column}>
                    <Text style={styles.extraInfoHeader}>Help Responses</Text>
                    <Text style={styles.extraInfoNum}>{helpResponses}</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
                <Text style={styles.buttonText}>Cerrar Sesión</Text>
                <MaterialIcons name="logout" size={24} color="black" />
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
    purpleTop: {
        width: '100%',
        height: '16%',
        backgroundColor: '#4C11CB',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: "center"
    }, 
    image:{
        width: screenWidth / 2.4,
        height: screenWidth / 2.4,
        marginTop: '10%',
        marginBottom: '5%',
        borderRadius: 100  
    },
    profileDetails: {
        marginTop: '25%',
        width: '80%',
        borderBottomColor: '#E9E8EA',
        borderBottomWidth: 1
    },
    pdFirstRow:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    userNameText:{
        fontSize: 22,
        fontFamily: 'Spartan_500Medium',
    },
    userEmailText:{
        color: '#8F8F8F',
        fontFamily: 'Spartan_400Regular',
        fontSize: 16,
        marginBottom: 20
    },
    extraInfo:{
        flexDirection:'row',
        justifyContent: 'space-between',
        fontFamily: 'Spartan_400Regular',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: '5%',
        width: '80%',
        borderBottomColor: '#E9E8EA',
        borderBottomWidth: 1,
        
    },
    extraInfoHeader:{
        color: '#BAB5B5',
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 5

    },
    extraInfoNum: {
        fontSize: 22,
        fontWeight: '700',
    },
    column: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginBottom: 20
    },


    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 10,
        backgroundColor:'#FF66C4',
        height: 60,
        width: '50%',
        borderRadius: 30,
        marginTop:'55%',
        marginLeft: '43%'
    },
    
    buttonText: {
        color: 'black',
        fontFamily: 'Spartan_600SemiBold',
        fontSize: 16
    }
})