import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image
} from "react-native";
import { auth } from "../../firebase";
import {getFirestore, doc, onSnapshot} from 'firebase/firestore';

const Settings = () => {
    const navigation = useNavigation();
    const currentEmail = auth.currentUser.email;
    const firestore = getFirestore();
    const [imageModal, imageModalOpen] = useState(false);
    const [currentUsername, setCurrentUsername] = useState('');  
    const [currentCoordinates, setCurrentCoordinates] = useState({});
    const [currentProfilePicture, setProfilePicture] = useState('');  
    const [helpResponses, setHelpResponses] = useState('');
    const [gotInfo, setGotInfo] = useState(false);
    // var profileIcon = alerta
    //     ? require ('../../assets/icons/invProfile.png')
    //     : require ('../../assets/icons/profile.png');
    // var settingsIcon = alerta
    //     ? require ('../../assets/icons/invSettingsDark.png')
    //     : require ('../../assets/icons/settingsDark.png');
    // var mapIcon = alerta
    //     ? require ('../../assets/icons/invMap.png')
    //     : require ('../../assets/icons/map.png');
    // const getColor = () =>{
    //     let color;
    //     if (alerta === false){
    //         color="#fff";
    //     }
    //     else if (alerta === true){
    //         color="#28194C";
    //     }
    //     return color;
    // }

    useEffect(() => {
        if(!gotInfo){
            onSnapshot(doc(firestore, "users2", currentEmail.toLowerCase()), (doc) => {
                if(doc.data() === undefined) return;
                setCurrentUsername(doc.data().username)
                setHelpResponses(doc.data().helpResponses)
                setProfilePicture(doc.data().pictureUrl)
                setCurrentCoordinates(doc.data().coordinates)    
                
            });
            setGotInfo(true);
        }});
      
 
    
    return(
       
        <View style = {styles.container}>
            <View style = {styles.profileInfo}>
            <Image style={styles.image} source={currentProfilePicture != ""? {uri: currentProfilePicture} :require('../../assets/img/initial-profile-picture.jpeg')}></Image>
                <View>
                    <Text style = {styles.usernameText}>{currentUsername}</Text>
                    <Text style = {styles.emailText}> {currentEmail}</Text>
                    <Text style = {styles.helpResponsesText}>Respuestas de ayuda: {helpResponses}</Text>
                </View>
            </View>

            <View style = {styles.changeSection}>
                <TouchableOpacity style = {styles.button} onPress = {() => navigation.navigate("Update Profile Picture", 
                {userData:{
                        username: currentUsername,
                        email: currentEmail, 
                        coordinates: currentCoordinates,
                        helpResponses: helpResponses,
                        pictureUrl: currentProfilePicture
                    }})}>
                    <Text style={styles.buttonText} >Cambiar foto de perfil</Text>
                    <Image style={styles.rightArrow} source={require('../../assets/icons/rightArrow.png')}></Image>
                </TouchableOpacity>
                <View style= {styles.divider}></View>
                <TouchableOpacity style = {styles.button} onPress={() => navigation.navigate("Update Username", 
                    {userData:{
                        username: currentUsername,
                        email: currentEmail, 
                        coordinates: currentCoordinates,
                        helpResponses: helpResponses,
                        pictureUrl: currentProfilePicture
                    }})}>
                    <Text style={styles.buttonText} >Cambiar nombre de usuario</Text>
                    <Image style={styles.rightArrow} source={require('../../assets/icons/rightArrow.png')}></Image>
                </TouchableOpacity>
                <View style= {styles.divider}></View>
                <TouchableOpacity style = {styles.button} onPress={() => navigation.navigate("Update Password")}>
                    <Text style={styles.buttonText}>Cambiar contraseña</Text>
                    <Image style={styles.rightArrow} source={require('../../assets/icons/rightArrow.png')}></Image>
                </TouchableOpacity>
            </View>

            <TouchableOpacity style = {styles.deleteSection}  onPress={() => navigation.navigate("Delete Account")}>
                    <Text style={styles.deleteText} >Borrar cuenta</Text>
            </TouchableOpacity> 

            {/* <View style= {[styles.navBar,{backgroundColor:getColor()}]} >
                <TouchableOpacity onPress={()=> navigation.replace("Alert")}>
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
            </View> */}

        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileInfo: {
        flexDirection: "row",
        width: '90%',
        height: '20%',
        backgroundColor: '#fff',
        marginTop: -250,
        marginBottom: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image:{
        width: '25%',
        height: '60%',
        marginTop: 15,
        borderRadius: 60,
        marginRight: 15,
        marginLeft: -50
    },
    usernameText:{
        fontSize: 20,
        fontWeight: '600',
    },
    emailText:{
        marginTop:5,
        color: '#A5A5A5'
    },
    helpResponsesText:{
        color: '#A5A5A5',
        paddingLeft: 3

    },
    changeSection: {
        width: '90%',
        height: '24%',
        backgroundColor: '#fff',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15
    },
    deleteSection: {
        height: '7%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor:'#D4B2EF',
        width: '90%',
        padding: 10,
        borderRadius: 10,
    },
    
    button: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        height: '33.3%',
       
    },
    divider: {
        width: '90%',
        height: '1%',
        backgroundColor: '#d4d2d2',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
        paddingLeft: 20,
    },
    rightArrow:{
        width:15,
        height:15,
        right: 20

    },
    icon: {
        width:20,
        height:20,
        right: 20
    },
    deleteText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16
     
    },
    input: {
        backgroundColor: '#EDEDED',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 45,
        width:'95%',


    },
    inputContainer: {
        width: '90%',
        marginTop: 20,
    },
    inputText: {
        fontWeight: '450',
        fontSize: 15
        // right: 45

    },

    modalUsernameText: {
        fontWeight: '500',
        fontSize: 20,
        marginLeft: 50

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
        height:38,
        width:38,
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
        width:"15%"
    }
  
})
