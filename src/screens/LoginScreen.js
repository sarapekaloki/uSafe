import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 
import * as Localization from 'expo-localization';
import React, { useState, useEffect} from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Pressable,
    View,
    StatusBar
} from "react-native";
import {
    useFonts,
    Roboto_700Bold,
    Roboto_400Regular
  } from '@expo-google-fonts/roboto';
import { auth } from "../../firebase";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";
import { loginWords } from "../lenguagesDicts/loginWords";
import AsyncStorage from "@react-native-async-storage/async-storage";


const LoginScreen = () => {
    const [len, setLen] = useState("EN");
    const {passwordVisibility, rightIcon, handlePasswordVisibility} =
        useTogglePasswordVisibility();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [anErrorOccurs, setError] = useState(false)
    const navigation = useNavigation()
    const localLenguage = Localization.locale.slice(0,2).toUpperCase()
    
    AsyncStorage.getItem('len').then(res => {
        if (res != null) {
            setLen(res)
        } else {
            const auxLen = ['EN', 'ES'].includes(localLenguage)? localLenguage : 'EN'
            setLen(auxLen)
            AsyncStorage.setItem('len', localLenguage)
        }
    })

    const handleLogin = (email, password) => {
        auth
        .signInWithEmailAndPassword(email.toLowerCase(), password)
        .then(userCredentials => {
            setError(false);
            userCredentials.user;
            navigation.navigate("Tabs", {"len": len});
        })
        .catch(error => {
            if (error.code === 'auth/invalid-email' || 'auth/wrong-password') {
                setError(true);
              }
           })
    }

    let [fontsLoaded] = useFonts({
        Roboto_700Bold,
        Roboto_400Regular
    });


    if (!fontsLoaded) {
        return null;
    }

    return(
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS ==="android"?"height":"padding"}
            >
                <StatusBar barStyle={"dark-content"}></StatusBar>

                <ScrollView style = {styles.scrollView} >
                <View style= {styles.whiteBox}>

                <Image
                    style={styles.logo}
                    source={require( '../../assets/img/logoPurple.png')}
                />
                <Text style= {styles.headerText}>{loginWords[len].title}</Text>

                <View  style = {styles.inputContainer}>
                    <Text style = {styles.text} >{loginWords[len].email}</Text>
                    <TextInput
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style = {styles.input}
                    />
                 </View>

                <View style={styles.inputContainer}>
                    <Text style = {styles.text}>{loginWords[len].password}</Text>
                    <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style = {styles.input}
                        secureTextEntry={passwordVisibility}
                    />
                    <Pressable onPress={handlePasswordVisibility} style={{left:'90%', top: -35}}>
                        <Ionicons name={rightIcon} size={24} color="grey" />
                    </Pressable>
                </View>
                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={{color: 'blue'}}
                    onPress={() => navigation.navigate("ForgotPassword", {len: len})}> {loginWords[len].forgotPassword}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => handleLogin(email, password)}
                    style = {styles.button}
                >
                    <Text style = {styles.buttonText}>{loginWords[len].title}</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>

                <Text style =  {anErrorOccurs? styles.errorText: {display: 'none'}}> {loginWords[len].error}</Text>

                <View style={styles.registerText}>
                        <Text>{loginWords[len].accountQuestion} </Text>
                        <Text style={{color: 'blue'}}
                            onPress={() => navigation.navigate("Register", {len: len})}>
                        {loginWords[len].register}
                        </Text>
                </View>
                </View>
            </ScrollView> 
            </KeyboardAvoidingView>               
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    button: {
        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginTop: '10%',
        backgroundColor:'#672BF5',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        elevation: 10,
    },
    buttonText: {
        color: 'white',
        fontFamily: 'Roboto_700Bold',
        fontSize: 18
    },
    container: {
        flex:1,
        height: '100%',
        backgroundColor: 'white'
    },
    errorText: {
        paddingTop: 10,
        color: 'red',
    },
    headerText:{
        fontFamily: 'Roboto_700Bold',
        fontSize: 26,
        marginBottom: 5
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10,
        height: 45,
        width:'100%',
        borderBottomWidth: 1.5,
        borderBottomColor: '#672BF5'
    },
    inputContainer: {
        width: '80%',
        marginLeft: -10,
        marginBottom: '5%'
    },
    logo: {
        width: 230,
        height: 230,
        marginTop: '20%',
    },
    passwordContainer:{
        flexDirection: 'row',
        alignItems:'center'
    },
    registerText: {
        flex: 1,
        fontFamily: 'Roboto_400Regular',
        flexDirection: 'row',
        padding: 10

    },
    scrollView: {
        width:'100%',
        height: '100%'
    
    },
    text: {
        fontFamily: 'Roboto_700Bold',
        color: "black",
        fontSize: 15,
        marginTop: 10,
    },
    whiteBox:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
    forgotPassword: {
        bottom: 30,
        alignSelf: 'flex-end',
        marginRight: '13%'
    }
})
