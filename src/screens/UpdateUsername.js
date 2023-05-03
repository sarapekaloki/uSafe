import React, { useState } from "react";
import { Entypo } from '@expo/vector-icons';
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView } from "react-native";
import { auth } from "../../firebase";
import {getFirestore, doc, updateDoc} from 'firebase/firestore';
import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
  } from '@expo-google-fonts/open-sans';

const UpdateUsername = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const firestore = getFirestore();
    const currentEmail = auth.currentUser.email;
    const currentUser = auth.currentUser;
    const userData = route.params.userData;
    const [updatedUsername, setUpdatedUsername] = useState('');

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
      });
    
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
                navigation.goBack();
                setUpdatedUsername("");      
            });       
        }
    };
    
    if (!fontsLoaded) {
        return null;
    }

    return(
        <KeyboardAvoidingView style={styles.usernameModalContainer}>
            <View style = {styles.header}>
                <Image style = {styles.headerImg} source={require('../../assets/img/clearLogo.png')}></Image>
            </View>
            <View style={styles.sectionTitle}>
                    <Entypo name="chevron-left" size={28} color="black" />
                <Text style={styles.sectionTitleText}>CAMBIAR NOMBRE DE USUARIO</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.inputHeader}>Ingresa un nuevo nombre de usuario</Text>
                <TextInput
                        placeholder={userData.username}
                        onChangeText={text => setUpdatedUsername(text)}
                        style = {styles.input}
                        maxLength = {15}
                />
            </View>
            <TouchableOpacity 
                    style = {updatedUsername.trim() == ""? styles.disabledButton :styles.confirmButton} 
                    disabled={updatedUsername.trim() == ""? true: false}
                    onPress={updateUsername}>
                    <Text style={styles.buttonText} >Confirmar</Text>
                </TouchableOpacity>
        </KeyboardAvoidingView>

    )
}

export default UpdateUsername

const styles = StyleSheet.create({
    usernameModalContainer: {
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
        marginTop: 20,
        width:'60%',
        height: 45,
        borderRadius:20,
        justifyContent: "center",
        alignItems:'center',
        backgroundColor:'#CACACA'
        
    },
    confirmButton:{
        marginTop: 20,
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