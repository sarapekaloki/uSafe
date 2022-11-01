import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ref, getStorage, deleteObject } from "firebase/storage";
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import {getFirestore, doc, deleteDoc} from 'firebase/firestore';
const screenWidth = Dimensions.get("screen").width;
// import {storage} from '@react-native-firebase/storage';

const DeleteAccount = () => {
    const navigation = useNavigation()
    const currentEmail = auth.currentUser.email;
    const currentUser = auth.currentUser;
    const storage = getStorage();
    const firestore = getFirestore()

    const deleteUser = () => {
        deleteObject(ref(storage,`users-images/${currentEmail}`))
        // TODO: que pedo con alarms , y fotos de perfil guardadas en storage
        currentUser.delete().then(() => {
            deleteDoc(doc(firestore, "users2", currentEmail.toLowerCase()));
            navigation.replace("Register");
        })
    }


    return(
        <KeyboardAvoidingView style={styles.usernameModalContainer}>
                    
        <View style={styles.modalHeader}>
            <Image style={styles.modalLogo} source={require('../../assets/img/longLogoPurple.png')}></Image>
        </View>
        
        <View style={styles.modalContentsContainer}>
        <TouchableOpacity onPress={() => navigation.replace("Configuracion")}>
            <Image style={styles.leftArrow} source={require('../../assets/icons/leftArrow.png')}></Image>
        </TouchableOpacity>
        
            <Text style = {styles.modalDeleteText} >Eliminar cuenta</Text>
        </View>
        <View style= {styles.dividerModal}></View>

        <View style= {styles.deleteContainer}>
                <Image style={styles.infoDeleteIcon} source={require('../../assets/icons/infoIcon.png')}></Image>
                <Text style ={styles.deleteMessage}>Estas a punto de eliminar tu cuenta, esta acción es irreversible. Si estas seguro, presiona el botón de eliminar cuenta. </Text>
        </View>

        <TouchableOpacity style = {styles.confirmButton} onPress = {deleteUser}>
            <Text style={styles.deleteText} >Eliminar cuenta</Text>
        </TouchableOpacity>
    </KeyboardAvoidingView>
    )
}

export default DeleteAccount

const styles = StyleSheet.create({
    usernameModalContainer: {
        alignItems: 'center',
        backgroundColor: '#FFF',
        height: '100%'
        // justifyContent: 'center'
    },
    modalHeader: {
        backgroundColor: '#D4B2EF',
        height: 110,
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
        height: 68
        
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
    modalDeleteText: {
        fontWeight: '500',
        fontSize: 20,
        marginLeft: 110
    },
    dividerModal: {
        width: '70%',
        height: '0.1%',
        backgroundColor: '#d4d2d2',
        marginTop: 10
    },
    deleteContainer: {
        flexDirection: "row",
        justifyContent:"center",
        width: "80%",
        marginTop: 10,
        marginBottom: 15
    },
    infoDeleteIcon: {
        width:20,
        height:20,
        marginRight: 10
    },
    deleteMessage: {
        textAlign: "justify"

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
     
    }
})