import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons'; 
import React, { useState} from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Pressable,
    View
} from "react-native";
// import {
//     useFonts,
//     Spartan_100Thin,
//     Spartan_200ExtraLight,
//     Spartan_300Light,
//     Spartan_400Regular,
//     Spartan_500Medium,
//     Spartan_600SemiBold,
//     Spartan_700Bold,
//     Spartan_800ExtraBold,
//     Spartan_900Black,
//   } from '@expo-google-fonts/spartan';
  
import { auth } from "../../firebase";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";
import AsyncStorage from '@react-native-async-storage/async-storage';


export const setData = async (key, value) => {
    value = JSON.stringify(value);
    await AsyncStorage.setItem(key, value);
};

export const getData = async (key) => {
    return JSON.parse(await AsyncStorage.getItem(key));
}

const LoginScreen = () => {
    const {passwordVisibility, rightIcon, handlePasswordVisibility} =
        useTogglePasswordVisibility();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [anErrorOccurs, setError] = useState(false)
    const navigation = useNavigation()

    // useFonts({
    //     Spartan_100Thin,
    //     Spartan_200ExtraLight,
    //     Spartan_300Light,
    //     Spartan_400Regular,
    //     Spartan_500Medium,
    //     Spartan_600SemiBold,
    //     Spartan_700Bold,
    //     Spartan_800ExtraBold,
    //     Spartan_900Black,
    // });

    const handleLogin = (email, password) => {
        auth
        .signInWithEmailAndPassword(email.toLowerCase(), password)
        .then(userCredentials => {
            setError(false);
            userCredentials.user;
            navigation.replace("Tabs");
        })
        .catch(error => {
            if (error.code === 'auth/invalid-email' || 'auth/wrong-password') {
                setError(true);
              }
           })
    }

    return(
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS ==="android"?"height":"padding"}
            >

                <ScrollView style = {styles.scrollView} >
                <View style= {styles.whiteBox}>

                <Image
                    style={styles.logo}
                    source={require( '../../assets/img/logoPurple.png')}
                />
                <Text style= {styles.headerText}> Iniciar Sesión</Text>

                <View  style = {styles.inputContainer}>
                    <Text style = {styles.text} >Correo</Text>
                    <TextInput
                        placeholder="Ingresar correo"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style = {styles.input}
                    />
                 </View>

                <View style={styles.inputContainer}>
                    <Text style = {styles.text}>Contraseña</Text>
                    <TextInput
                        placeholder="Ingresar contraseña"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style = {styles.input}
                        secureTextEntry={passwordVisibility}
                    />
                    <Pressable onPress={handlePasswordVisibility} style={{left:'90%', top: -35}}>
                        <Ionicons name={rightIcon} size={24} color="grey" />
                    </Pressable>
                </View>

                <TouchableOpacity
                    onPress={() => handleLogin(email, password)}
                    style = {styles.button}
                >
                    <Text style = {styles.buttonText}>Iniciar Sesión</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" />
                </TouchableOpacity>

                <Text style =  {anErrorOccurs? styles.errorText: {display: 'none'}}> Contraseña o correo incorrectos. </Text>

                <View style={styles.registerText}>
                        <Text>¿No tienes cuenta? </Text>
                        <Text style={{color: 'blue'}}
                            onPress={() => navigation.replace("Register")}>
                        Regístrate
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
        fontWeight: '700',
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
        fontWeight: 'bold',
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
        flexDirection: 'row',
        padding: 10

    },
    scrollView: {
        width:'100%',
        height: '100%'
    
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 10,
    },
    whiteBox:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%'
    },
})
