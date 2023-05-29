import React, {useState} from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, ScrollView } from "react-native";
import { Entypo } from '@expo/vector-icons';
import {firebaseConfig} from "../../firebase";
import firebase from "firebase/compat";
import Modal from "react-native-modal";
import { MaterialIcons } from '@expo/vector-icons';
import { resetPasswordWords } from "../lenguagesDicts/resetPasswordWords";

import {
    useFonts,
    Spartan_800ExtraBold,
    Spartan_700Bold,
    Spartan_600SemiBold,
    Spartan_500Medium
  } from '@expo-google-fonts/spartan';


const MainForgotPassword = () => {
    firebase.initializeApp(firebaseConfig);
    const navigation = useNavigation();
    const route = useRoute();
    const [email, setEmail] = useState('')
    const len = route.params.len;
    const [invalidAccount, setInvalidAccount] = useState(false);
    const [accountExists, setAccountExists] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false)




    let [fontsLoaded] = useFonts({
        Spartan_800ExtraBold,
        Spartan_500Medium,
        Spartan_700Bold,
        Spartan_600SemiBold
      });

    async function checkAccountExists(email) {
        let accountExists;
        await firebase.auth().fetchSignInMethodsForEmail(email)
            .then(function(signInMethods) {
            // If signInMethods array is empty, the email is not associated with any existing account
            if (signInMethods.length === 0) {
                setInvalidAccount(true)
                setAccountExists(false)
                
            } else {
                setInvalidAccount(false)
                setAccountExists(true)
            }
            }).catch(function(error) {
                setInvalidAccount(true)
                setAccountExists(false)
            });
    }
    async function handleReset() {
        await checkAccountExists(email.toLowerCase())
        if (accountExists){
            await firebase.auth().sendPasswordResetEmail(email.toLowerCase())
            setIsModalVisible(true)
        }
    }
    const finishConfirmationMessage = () => {
        navigation.navigate("Login");                     
     }

    if (!fontsLoaded) {
        return null;
    }

    return(
       <KeyboardAvoidingView style = {styles.container}>
            <ScrollView style = {styles.scrollView}>
                <Image style ={styles.img} source={require('../../assets/img/forgotPassword.png')}></Image>

                <Text style={styles.headerText}>{resetPasswordWords[len].title}</Text>
                <View  style = {styles.inputContainer}>
                        <Text style = {styles.text} >{resetPasswordWords[len].inputHeader}</Text>
                        <TextInput
                            placeholder={resetPasswordWords[len].placeholder}
                            value={email}
                            onChangeText={text => setEmail(text)}
                            style = {styles.input}
                        />
                </View>
                <Text style={invalidAccount? styles.error: {display: 'none'}}>{resetPasswordWords[len].error}</Text>

                <TouchableOpacity
                    onPress={() => handleReset()}
                    style = {styles.button}
                >
                    <Text style = {styles.buttonText}>{resetPasswordWords[len].button}</Text>
                </TouchableOpacity>
                <Text style={styles.login} onPress={() => navigation.navigate("Login")}>{resetPasswordWords[len].login}</Text>
            </ScrollView>

            <Modal isVisible={isModalVisible}>
                <View style={styles.modal}>
                    <View style={styles.icon}>
                        <MaterialIcons name="email" size={24} color="white" />
                    </View>
                    <Text style={styles.modalDescription}>
                    {resetPasswordWords[len].modalDescription}
                    </Text>
                    <TouchableOpacity style={styles.modalButton} onPress={finishConfirmationMessage}>
                        <Text style={styles.modalButtonText}>{resetPasswordWords[len].modalButton}</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            
       </KeyboardAvoidingView>
    )
}

export default MainForgotPassword

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: '#fff'
    },
    img: {
        width: 250,
        height: 250,
        marginTop: 40,
        alignSelf: 'center'
    },
    headerText: {
        fontFamily: 'Spartan_700Bold',
        fontSize: 33,
        alignSelf: 'center'
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10,
        height: 45,
        fontFamily: 'Spartan_500Medium',
        width:'100%',
        borderBottomWidth: 1.5,
        borderBottomColor: '#672BF5'
    },
    inputContainer: {
        width: '80%',
        marginLeft: -10,
        marginTop: 30,
        alignSelf: 'center'
    },
    text: {
        fontFamily: 'Spartan_600SemiBold',
        color: "black",
        fontSize: 15,
        marginTop: 10,
    },
    scrollView: {
        width:'100%',
        height: '100%'
    },
    button: {
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '15%',
        backgroundColor:'#672BF5',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        elevation: 10,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Spartan_600SemiBold',
        fontSize: 15
    },
    login: {
        color: 'blue',
        fontFamily: 'Spartan_500Medium',
        marginTop: 20,
        alignSelf: 'center'
    }, 
    error: {
        color: 'red',
        fontFamily: 'Spartan_500Medium',
        marginLeft: 35,
        fontSize: 12,
        marginTop: 15
    },
    modal: {
        "backgroundColor": '#FFF',
        "borderRadius": 20,
        "height": 200,
        'alignItems': 'center'
    },
    icon: {
        'backgroundColor': '#EFA8EC',
        'width': 50,
        'height': 50,
        'alignItems': 'center',
        'justifyContent': 'center',
        'marginTop': 10,
        'borderRadius': 50
    },
    modalDescription: {
        'fontFamily': 'Spartan_500Medium',
        'fontSize': 16,
        'marginTop': 15,
        textAlign: 'center'
    },
     modalButton: {
        marginTop: 35,
        width:'50%',
        height: 45,
        borderRadius:20,
        justifyContent: "center",
        alignItems:'center',
        backgroundColor:'#A29AFF'
     },
     modalButtonText: {
        'fontFamily': 'Spartan_500Medium',
        'color': '#fff'
     }
})