import React, { useEffect, useState, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase";
import {getFirestore, collection, getDocs} from 'firebase/firestore';
// import {storage} from '@react-native-firebase/storage';

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
    const [profilePicture, setProfilePicture] = useState('')
    const [profilePictureURL, setProfilePictureURL] = useState('')
    var profileIcon = alerta
        ? require ('../../assets/icons/invProfileDark.png')
        : require ('../../assets/icons/profileDark.png');
    var settingsIcon = alerta
        ? require ('../../assets/icons/invSettings.png')
        : require ('../../assets/icons/settings.png');
    var mapIcon = alerta
        ? require ('../../assets/icons/invMap.png')
        : require ('../../assets/icons/map.png');

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

    const getColor = () =>{
        let color;
        if (alerta === false){
            color="#fff";
        }
        else if (alerta === true){
            color="#28194C";
        }
        return color;
    }

    const [image, set_image ] = useState(image1)
    const bottomSheet = useRef();
    function changeAlert(){
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        set_image(image === image1 ? image2 : image1);}

    return(
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
           <View style= {[styles.navBar,{backgroundColor:getColor()}]} >
               <TouchableOpacity onPress={() => bottomSheet.current.show()}>
                    <Image style={styles.alertIcon} source={require('../../assets/icons/alert.png')}></Image>
               </TouchableOpacity>
               <TouchableOpacity style={styles.navBarButtons} onPress={()=> navigation.replace("Configuración")}>
                   <Image style={styles.navBarSettingsIcon} source={settingsIcon}></Image>
               </TouchableOpacity>
               <TouchableOpacity style={styles.navBarButtons} onPress={()=> navigation.replace("Perfil")}>
                   <Image style={styles.profileIcon} source={profileIcon}></Image>
               </TouchableOpacity>
               <TouchableOpacity style={styles.navBarButtons} onPress={()=> navigation.replace("Map")}>
                   <Image style={styles.mapIcon} source={mapIcon}></Image>
               </TouchableOpacity>
           </View>
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
        height: '30%',
        backgroundColor: '#fff',
        marginTop: -300,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        elevation:10
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
        alignItems: 'center',
        elevation:10
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

    navBar:{
        width:"100%",
        height:"12%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position:"absolute",
        bottom:0,
        flexDirection:"row",
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .6,
        justifyContent:"space-around",
    },

    mapIcon:{
        height:30,
        width:30,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .2,
    },

    profileIcon:{
        height:65,
        width:65,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .1,
    },

    navBarSettingsIcon:{
        height:25,
        width:25,
        marginLeft:-15,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .2,
    },

    alertIcon:{
        width:200,
        height:"100%",
        marginTop:"5%",
        marginLeft:-10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .2,
        padding:.1,

    },

    navBarButtons:{
        height:"100%",
        justifyContent:"space-evenly",
        alignItems:"center",
        width:"15%",
    }
    

})