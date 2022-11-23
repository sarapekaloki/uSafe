import React, { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import {getFirestore, doc, updateDoc} from 'firebase/firestore';


const UpdateUsername = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const firestore = getFirestore();
    const currentEmail = auth.currentUser.email;
    const currentUser = auth.currentUser;
    const userData = route.params.userData;
    const [updatedUsername, setUpdatedUsername] = useState('');

    const updateUsername = () => {
        const newDoc = {
            coordinates: userData.coordinates,
            email: userData.email,
            helpResponses: userData.helpResponses,
            pictureUrl: userData.pictureUrl,
            username: updatedUsername,
            token: userData.token
        };
        setUpdatedUsername(updatedUsername.trim())
        if(updatedUsername != ""){
            const docRef = doc(firestore, "users2", currentEmail);
            updateDoc(docRef, newDoc).then(() => {
                navigation.navigate('Tabs', { screen: 'Configuracion' });
                setUpdatedUsername("");      
            });       
        }
    };


    return(
        <KeyboardAvoidingView style={styles.usernameModalContainer}>
            
            <View style={styles.modalHeader}>
                <Image style={styles.modalLogo} source={require('../../assets/img/longLogoPurple.png')}></Image>
            </View>
            
            <View style={styles.modalContentsContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Tabs', { screen: 'Configuracion' })}>
                    <Image style={styles.leftArrow} source={require('../../assets/icons/leftArrow.png')}></Image>
                </TouchableOpacity>
                    
                <Text style = {styles.modalUsernameText} >Cambiar nombre de usuario</Text>
            </View>
            <View style= {styles.dividerModal}></View>

            <View  style = {styles.inputContainer}>
                <Text style = {styles.inputText}> Ingresar un nuevo nombre de usuario</Text>
                    <TextInput
                        placeholder={userData.username}
                        onChangeText = {text => setUpdatedUsername(text)}
                        style = {styles.input}
                        maxLength={15}
                    />
                <View style = {styles.infoContainer}>
                    <Image style={styles.infoIcon} source={require('../../assets/icons/infoIcon.png')}></Image>
                    <Text style ={styles.reminderMessage}>Recuerda que será visible para todos los usuarios</Text>
                </View>
            </View>
            <TouchableOpacity 
                style = {updatedUsername.trim() == ""? styles.disabledButton :styles.confirmButton} 
                disabled={updatedUsername.trim() == ""? true: false}
                onPress={updateUsername}>
                <Text style={styles.deleteText} >Confirmar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>

    )
}

export default UpdateUsername

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
    modalUsernameText: {
        fontWeight: '500',
        fontSize: 20,
        marginLeft: 50

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
        fontSize: 17
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
    infoContainer: {
        flexDirection: "row",
        marginTop: 10,
        marginLeft: 30
    },
    infoIcon: {
        width:15,
        height:15,
        right: 30
    },
    reminderMessage: {
        fontWeight: '300',
        fontSize: 12,
        color:'#A5A5A5',
        right:25
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
    deleteText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 16
     
    },
    disabledButton: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor:'#b8b8b8',
        width: '90%',
        borderRadius: 10,
    },
   
})