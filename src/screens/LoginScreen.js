import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
    Pressable
} from "react-native";
import { auth } from "../../firebase";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";

const LoginScreen = () => {
    const {passwordVisibility, rightIcon, handlePasswordVisibility} =
        useTogglePasswordVisibility();
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const anErrorOccurs = false

    useEffect(() => {
         const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])

    const handleSignUp = () => {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log("Registered with: ", user.email);
        })
        .catch(error => {anErrorOccurs = true})
    }

    const handleLogin = () => {
        auth
        .signInWithEmailAndPassword(email, password)
        .then(userCredentials => {
            const user = userCredentials.user;
            console.log("Logged in with: ", user.email);
        })
        .catch(error => alert(error.message))
    }

    return(

            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
            >
                <Text style= {styles.headerText}> Iniciar Sesión</Text>
                <ScrollView style = {styles.scrollView} >
                <View style= {styles.whiteBox}>

                <Image
                    style={styles.logo}
                    source={require( '../../assets/img/logoPurple.png')}
                />
                <View style = {styles.inputContainer}>
                    <Text style = {styles.text} >Correo</Text>
                    <TextInput
                        placeholder="Ingresar correo"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        style = {styles.input}
                    />
                    <Text style = {styles.text}>Contraseña</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Ingresar contraseña"
                            value={password}
                            onChangeText={text => setPassword(text)}
                            style = {styles.input}
                            secureTextEntry={passwordVisibility}
                        />
                        <Pressable onPress={handlePasswordVisibility} style={{left:5}}>
                            <MaterialCommunityIcons name={rightIcon} size={22} color="#232323"/>
                        </Pressable>
                    </View>
                </View>


                <TouchableOpacity
                    onPress={handleLogin}
                    style = {styles.button}
                >
                    <Text style = {styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>


                <View style={styles.registerText}>
                        <Text>No tienes cuenta? </Text>
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
        marginTop: 40,
        backgroundColor:'#D4B2EF',
        width: '80%',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    container: {
        flex:1,
        backgroundColor: '#28194C',
        height: '100%',
    },
    headerText:{
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 60,
        marginBottom: 10,
        color: 'white',
        paddingVertical: 10,
        paddingHorizontal: 10

    },
    input: {
        backgroundColor: '#EBEBEB',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 40,
        width:'100%',
    },
    inputContainer: {
        width: '80%'
    },
    logo: {
        width: 250,
        height: 250,
        marginTop: 20
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
        backgroundColor:'white',
        width:'100%',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
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
    },
})
