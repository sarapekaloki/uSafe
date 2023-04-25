import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ref, getStorage, deleteObject } from "firebase/storage";
import { Image, StyleSheet, Text, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons'; 
import {getFirestore, doc, deleteDoc, query, onSnapshot, where, collection} from 'firebase/firestore';

import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
  } from '@expo-google-fonts/open-sans';


const DeleteAccount = () => {
    const navigation = useNavigation();
    const db = getFirestore();
    const currentEmail = auth.currentUser.email;
    const currentUser = auth.currentUser;
    const storage = getStorage();
    const firestore = getFirestore();
    const [ gotInfo, set_gotInfo ] = useState(false);
    const [ disabledButton , setDisabledButton ] = useState(false);
  

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
      });

    useEffect(() => {
        if(!gotInfo){
            setDisabledButton(false)
            let helpingMode = false

            const q =  query(  collection(db, "alarms"), where("alarmingUser", "==", auth.currentUser.email))
             onSnapshot(q,  (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc.data().alarmingUser === auth.currentUser.email){
                        setDisabledButton(true)
                    }  
                });
            })

            const q2 = query(collection(db, "alarms"), where("users", "array-contains", auth.currentUser.email));
            onSnapshot(q2,  (querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if(doc){
                        setDisabledButton(true)
                    }
                });
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
                <Text style={styles.sectionTitleText}>BORRAR CUENTA</Text>
            </View>
            <View style ={styles.deleteMessage}>
                <Feather name="info" size={20} color="#4C11CB" />
                <Text style = {styles.deleteText}>
                    Estas a punto de eliminar tu cuenta, esta acción es irreversible. Si estas seguro, presiona el botón de eliminar cuenta.
                </Text>
            </View>
                
            <TouchableOpacity style={ disabledButton? styles.disabledButton: styles.confirmButton} disabled={disabledButton} onPress = {deleteUser}>
                <Text style={styles.buttonText} >Eliminar cuenta</Text>
            </TouchableOpacity> 
      
    </KeyboardAvoidingView>
    )
}

export default DeleteAccount

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
    deleteMessage: {
        flexDirection: 'row',
        marginTop: 20,
         marginBottom: 20,
         marginHorizontal: 20
    },
    deleteText:{
        fontFamily:'OpenSans_400Regular',
        marginLeft: 10,
        fontSize: 14
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
    }
})