import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
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
import { auth } from "../../firebase";
import {MaterialCommunityIcons} from "@expo/vector-icons";
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

    // useEffect(() => {
    //      const unsubscribe = auth.onAuthStateChanged(user => {
    //         setError(false)
    //         if (user) {
    //             navigation.replace("Tabs")

    //         }
    //     });
    //     getData("userCredentials").then((res) => {
    //         if (!res) return;
    //         handleLogin(res.email, res.password);
    //         setError(false)
    //     });
    //     return unsubscribe
    // }, [])

    const handleLogin = (email, password) => {
        auth
        .signInWithEmailAndPassword(email, password)
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
                    <Pressable onPress={handlePasswordVisibility} style={{left:'102%', top: -30}}>

                        <MaterialCommunityIcons name={rightIcon} size={22} color="#232323"/>
                    </Pressable>
                </View>

                <TouchableOpacity
                    onPress={() => handleLogin(email, password)}
                    style = {styles.button}
                >
                    <Text style = {styles.buttonText}>Iniciar Sesión</Text>
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
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        backgroundColor:'#914FFC',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        elevation: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
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
        marginBottom: 5,
        color: '#28194C',
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 45,
        width:'100%',
        borderWidth: 1,
        borderColor: '#CFCFCF'
    },
    inputContainer: {
        width: '80%'
    },
    logo: {
        width: 230,
        height: 230,
        marginTop: '10%',
        marginBottom: 30
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
