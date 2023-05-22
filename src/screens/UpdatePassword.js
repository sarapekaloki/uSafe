import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TextInput, Pressable, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import {EmailAuthProvider} from 'firebase/auth';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { passwordWords } from "../lenguagesDicts/passwordWords";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";
import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
  } from '@expo-google-fonts/open-sans';


const UpdatePassword = () => {
    const navigation = useNavigation()
    const route = useRoute()
    const len = route.params.len;
    const currentEmail = auth.currentUser.email;
    const currentUser = auth.currentUser;
    const {passwordVisibility, rightIcon, handlePasswordVisibility} =
    useTogglePasswordVisibility();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [currentPasswordError, setCurrentPasswordError] = useState(false);
    const [passwordEmptyError, setPasswordEmptyError] = useState(false);
    const [newPasswordError, setNewPasswordError] = useState(false);
    const [passwordLenghtError, setPasswordLenghtError] = useState(false);
    const [passwordNumberError, setPasswordNumberError] = useState(false); 
    const [passwordUpperLowerCaseError, setPasswordUpperLowerCaseError] = useState(false);
    const [disableButton, setDisableButton] = useState(false);

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
      });

    const updatePassword = () => {
        const credentials = EmailAuthProvider.credential(currentEmail, currentPassword);

        if(newPassword.trim() == ''){
            setPasswordEmptyError(true);
            setNewPasswordError(false);
            currentUser.reauthenticateWithCredential(credentials).then(() => {
                setCurrentPasswordError(false);
            }).catch(() => {
                setCurrentPasswordError(true);
            })
        } else {
         setPasswordEmptyError(false);
         const res = checkNewPasswordErrors();
 
         currentUser.reauthenticateWithCredential(credentials).then(() => {
         setCurrentPasswordError(false);

         if(!res.lenght && !res.number && !res.upperLower){
            setDisableButton(true);
             setNewPasswordError(true);
             currentUser.updatePassword(newPassword).then(() => {
                 sleep(1000);
                 setCurrentPassword('');
                 setNewPassword(''); 
                 navigation.goBack();                     
             })
 
         }}).catch((error) => {
             setCurrentPasswordError(true);
         })
         }
        
     };
 
     const checkNewPasswordErrors = () => {
         const res = {
             lenght: false,
             number: false,
             upperLower: false
         }
         if(newPassword.length<8){
             setPasswordLenghtError(true);
             setNewPasswordError(true);
             res.lenght =  true;
         } else {
             setPasswordLenghtError(false);
             res.lenght =  false;
         }
         if(!checkForNumber(newPassword)){
             setPasswordNumberError(true);
             setNewPasswordError(true);
             res.number = true;
         }
         else {
             setPasswordNumberError(false)
             res.number = false;
         }
         if(!checkUppercase(newPassword) || !checkLowercase(newPassword)){
             setPasswordUpperLowerCaseError(true);
             setNewPasswordError(true);
             res.upperLower = true;
         } else {
             setPasswordUpperLowerCaseError(false);
             res.upperLower = false;
         }
         return res
     };
 
     const checkUppercase = (str) => {
         for (var i=0; i<str.length; i++){
           if (str.charAt(i) == str.charAt(i).toUpperCase() && str.charAt(i).match(/[a-z]/i)){
             return true;
           }
         }
         return false;
     };
 
     const sleep = (milliseconds) => {
         var start = new Date().getTime();
         for (var i = 0; i < 1e7; i++) {
           if ((new Date().getTime() - start) > milliseconds){
             break;
           }
         }
       }
 
     const checkLowercase = (str) => {
         for (var i=0; i<str.length; i++){
           if (str.charAt(i) == str.charAt(i).toLowerCase() && str.charAt(i).match(/[a-z]/i)){
             return true;
           }
         }
         return false;
     };
     const checkForNumber = (str) => {
         return /\d/.test(str);
       }

    if (!fontsLoaded) {
        return null;
    }

    return(
        <KeyboardAvoidingView style={styles.container}>
            <View style = {styles.header}>
                <Image style = {styles.headerImg} source={require('../../assets/img/clearLogo.png')}></Image>
            </View>
            <View style={styles.sectionTitle}>
                <TouchableOpacity  onPress={() => {setNewPasswordError(false); setPasswordEmptyError(false); setCurrentPasswordError(false); setCurrentPassword('');
                    setNewPassword(''); navigation.goBack()} }>
                    <Entypo name="chevron-left" size={28} color="black" />
                </TouchableOpacity>
                <Text style={styles.sectionTitleText}>{passwordWords[len].title}</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputHeader}>{passwordWords[len].currentPassword}</Text>
                <TextInput
                        value={currentPassword}
                        onChangeText={text => setCurrentPassword(text)}
                        style = {styles.input}
                        secureTextEntry={true}
                />
            </View>
            <Text style =  {currentPasswordError? styles.errorText2: {display: 'none'}}> {passwordWords[len].incorrectPassword} </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.inputHeader}>{passwordWords[len].newPassword}</Text>
                <TextInput
                        onChangeText={text => setNewPassword(text)}
                        style = {styles.input}
                        secureTextEntry={passwordVisibility}
                />
                <Pressable onPress={handlePasswordVisibility} style={{left:'90%', top: -35}}>
                        <Ionicons name={rightIcon} size={24} color="grey" />
                </Pressable>
            </View>

            <View style = {newPasswordError? styles.errorContainer: {display: 'none'}}>
                <Text style =  {passwordLenghtError? styles.errorText: styles.noErrorText}>{passwordWords[len].lenError} </Text>
                <Text style =  {passwordUpperLowerCaseError? styles.errorText: styles.noErrorText}>{passwordWords[len].capsError} </Text>
                <Text style =  {passwordNumberError? styles.errorText: styles.noErrorText}>{passwordWords[len].numError} </Text>
            </View>
            <TouchableOpacity style = {newPassword.trim() == "" || currentPassword.trim() == "" ? styles.disabledButton: styles.confirmButton} onPress={updatePassword} disabled={newPassword.trim() == "" || currentPassword.trim() == "" ? true : false}>
                <Text style={styles.buttonText}>{passwordWords[len].button}</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default UpdatePassword

const styles = StyleSheet.create({
    container: {
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

    inputContainer: {
        width: '90%',
        marginTop: 20
    },
    inputHeader:{
        fontFamily:'OpenSans_400Regular',
        fontSize: 15,
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        height: 50,
        width:'100%',
        borderBottomWidth: 1.5,
        borderBottomColor: '#672BF5'
    },
    disabledButton:{
        marginTop: 10,
        width:'60%',
        height: 45,
        borderRadius:20,
        justifyContent: "center",
        alignItems:'center',
        backgroundColor:'#CACACA'
        
    },
    confirmButton:{
        marginTop: 10,
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
    },
    errorText2: {
        fontFamily:'OpenSans_400Regular',
        color: 'red',
        alignSelf:'flex-start',
        marginLeft: 20,
        marginTop: 10
    },
    errorContainer: {
        alignSelf:'flex-start',
        marginLeft: 20,
        bottom: 10
    },
    errorText:{
        fontFamily:'OpenSans_400Regular',
        color: 'red',
    }, 
    noErrorText:{
        fontFamily:'OpenSans_400Regular',
        color: 'green',
    }
})