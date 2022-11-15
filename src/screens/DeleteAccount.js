import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ref, getStorage, deleteObject } from "firebase/storage";
import { Image, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import {getFirestore, doc, deleteDoc, query, onSnapshot, where, collection} from 'firebase/firestore';

const DeleteAccount = () => {
    const navigation = useNavigation();
    const db = getFirestore();
    const currentEmail = auth.currentUser.email;
    const currentUser = auth.currentUser;
    const storage = getStorage();
    const firestore = getFirestore();
    const [ gotInfo, set_gotInfo ] = useState(false);
    const [ disabledButton , setDisabledButton ] = useState(false);
  
    useEffect( () => {
        if(!gotInfo){
            const q = query(collection(db, "alarms"), where("alarmingUser", "==", auth.currentUser.email))
            onSnapshot(q,  (querySnapshot) => {
                let alertModeActive = false
                querySnapshot.forEach((doc) => {
                    if(doc.data().alarmingUser === auth.currentUser.email){
                        alertModeActive = true
                    } 
                });
                setDisabledButton(alertModeActive);
            })

            const q2 = query(collection(db, "alarms"), where("users", "array-contains", auth.currentUser.email));
            onSnapshot(q2,  (querySnapshot) => {
                let helpingMode = false
                querySnapshot.forEach((doc) => {
                    if(doc){
                        helpingMode = true
                    }
                });
                setDisabledButton(helpingMode);
            });
        set_gotInfo(true)
        }
    })

    const deleteUser = () => {
        deleteObject(ref(storage,`users-images/${currentEmail}`))
        const storageRef = ref(storage, `users-images/${currentEmail}`);

        // TODO: que pedo con alarms
        currentUser.delete().then(() => {
            deleteDoc(doc(firestore, "users2", currentEmail.toLowerCase()));
            if(storageRef){
                deleteObject(storageRef).then(() => {
                    // File deleted successfully
                }).catch((error) => {
                    // Uh-oh, an error occurred!
                });
            }
            navigation.replace("Register");
        })
    }


    return(
        <KeyboardAvoidingView style={styles.usernameModalContainer}>
                    
        <View style={styles.modalHeader}>
            <Image style={styles.modalLogo} source={require('../../assets/img/longLogoPurple.png')}></Image>
        </View>
        
        <View style={styles.modalContentsContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Tabs', { screen: 'Configuracion' })}>
            <Image style={styles.leftArrow} source={require('../../assets/icons/leftArrow.png')}></Image>
        </TouchableOpacity>
        
            <Text style = {styles.modalDeleteText} >Eliminar cuenta</Text>
        </View>
        <View style= {styles.dividerModal}></View>

        <View style= {styles.deleteContainer}>
                <Image style={styles.infoDeleteIcon} source={require('../../assets/icons/infoIcon.png')}></Image>
                <Text style ={styles.deleteMessage}>Estas a punto de eliminar tu cuenta, esta acción es irreversible. Si estas seguro, presiona el botón de eliminar cuenta. </Text>
        </View>

        <TouchableOpacity style = {disabledButton? styles.disabledButton: styles.confirmButton} onPress = {deleteUser} disabled = {disabledButton}>
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
    modalDeleteText: {
        fontWeight: '500',
        fontSize: 20,
        marginLeft: 110
    },
    dividerModal: {
        width: '70%',
        height: '0.15%',
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
     
    },
    disabledButton: {
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        backgroundColor:'#b8b8b8',
        width: '90%',
        borderRadius: 10,
    }
})