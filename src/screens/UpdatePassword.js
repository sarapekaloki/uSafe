import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TextInput, Pressable, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import {EmailAuthProvider} from 'firebase/auth';
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";


const UpdatePassword = () => {
    const navigation = useNavigation()
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
             setNewPasswordError(true);
             currentUser.updatePassword(newPassword).then(() => {
                 sleep(1000);
                 setCurrentPassword('');
                 setNewPassword(''); 
                 navigation.navigate('Tabs', { screen: 'Configuracion' }) 
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


    return(
        <KeyboardAvoidingView style={styles.usernameModalContainer}>
            
            <View style={styles.modalHeader}>
                <Image style={styles.modalLogo} source={require('../../assets/img/longLogoPurple.png')}></Image>
            </View>
            
            <View style={styles.modalContentsContainer}>
            <TouchableOpacity onPress={() => {setNewPasswordError(false); setPasswordEmptyError(false); setCurrentPasswordError(false); setCurrentPassword('');
            setNewPassword(''); navigation.navigate('Tabs', { screen: 'Configuracion' })} }>
                <Image style={styles.leftArrow} source={require('../../assets/icons/leftArrow.png')}></Image>
            </TouchableOpacity>
                
                <Text style = {styles.modalPasswordText} >Cambiar contraseña</Text>
            </View>
            <View style= {styles.dividerModal}></View>

            
            <View  style = {styles.inputContainer}>
                <Text style = {styles.inputText}> Ingresa tu contraseña actual</Text>
                    <TextInput
                            placeholder="Ingresar contraseña"
                            value={currentPassword}
                            onChangeText={text => setCurrentPassword(text)}
                            style = {styles.input}
                            secureTextEntry={true}
                    />
                <Text style =  {currentPasswordError? styles.errorText2: {display: 'none'}}> Contraseña actual incorrecta. </Text>

                 
                <Text style = {styles.inputText2}> Ingresa tu nueva contraseña</Text>
                    <TextInput
                        placeholder="Ingresar nueva contraseña"
                        onChangeText={text => setNewPassword(text)}
                        style = {styles.input}
                        secureTextEntry={passwordVisibility}
                    />
                <Pressable onPress={handlePasswordVisibility} style={{left:'97%', top: -35}}>
                        <MaterialCommunityIcons name={rightIcon} size={22} color="#232323"/>
                    </Pressable>
                <Text style={passwordEmptyError? styles.emptyErrorText: {display:'none'}}>Este campo no puede estar vacío</Text>
                <View style = {newPasswordError? styles.errorContainer: {display: 'none'}}>
                    <Text style =  {passwordLenghtError? styles.errorText: styles.noErrorText}>1. Longitud de mínimo 8 caracteres </Text>
                    <Text style =  {passwordUpperLowerCaseError? styles.errorText: styles.noErrorText}>2. Contener mínimo una mayúscula y una minúscula </Text>
                    <Text style =  {passwordNumberError? styles.errorText: styles.noErrorText}>3. Contener por lo menos un número </Text>
                </View>
            </View>
            <TouchableOpacity style = {styles.confirmButton} onPress={updatePassword}>
                <Text style={styles.buttonText}>Confirmar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    )
}

export default UpdatePassword

const styles = StyleSheet.create({
    usernameModalContainer: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: '100%'
        // justifyContent: 'center'
    },
    modalHeader: {
        backgroundColor: '#D4B2EF',
        height: '12%',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        shadowOffset: {width: -2, height: 4},  
        shadowColor: '#171717',  
        shadowOpacity: 0.2,  
        shadowRadius: 3,  
    },
    modalLogo: {
        marginTop:25,
        width: 180,
        height: 55
        
    },
    modalContentsContainer: {
        flexDirection: "row",
        marginTop: 15,
        width:"100%",
        justifyContent:"flex-start"
    },
    leftArrow: {
        width:20,
        height:20,
        left: 10,
    },
    modalPasswordText: {
        fontWeight: '500',
        fontSize: 20,
        marginLeft: 80

    },
    dividerModal: {
        width: '70%',
        height: '0.15%',
        backgroundColor: '#d4d2d2',
        marginTop: 10
    },
    inputContainer: {
        width: '90%',
        marginTop: 20,
    },
    inputText: {
        fontWeight: '450',
        fontSize: 17,
        // right: 45

    },
    inputText2: {
        fontWeight: '450',
        fontSize: 17,
        marginTop: 15
        // right: 45

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
    errorText2: {
        color: 'red',
        top: 8
    },
    errorText: {
        color: 'red',
        top:-15,
    },
    confirmButton: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor:'#28194C',
        width: '90%',
        borderRadius: 10,
    },
    buttonText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16
     
    },
    noErrorText:{
        color:'green',
        top: -15
    },
    emptyErrorText:{
        top:-12,
        color: 'red'
    },
})