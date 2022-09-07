import { useNavigation } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
import { KeyboardAvoidingView, StyleSheet, Text, Image, TextInput, TouchableOpacity, View, ScrollView} from "react-native";
import { auth } from "../../firebase";

const LoginScreen = () => {

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
                    <TextInput 
                        placeholder="Ingresar contraseña" 
                        value={password} 
                        onChangeText={text => setPassword(text)} 
                        style = {styles.input}
                        secureTextEntry
                    />
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
                        Registrate
                        </Text>
                </View>
                </View>
            </ScrollView>

            </KeyboardAvoidingView>
       
    )
}

export default LoginScreen

const styles = StyleSheet.create({
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
    scrollView: {
        backgroundColor:'white',
        width:'100%',
        borderTopLeftRadius: '30px',
        borderTopRightRadius: '30px',
    },
    whiteBox:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
       

    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: '#EBEBEB',
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 40
    },
    registerText: {
        flex: 1,
        flexDirection: 'row',
        padding: 10
        
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 10,
        
    },
    logo: {
        width: 250,
        height: 250,
        marginTop: 20
    },

    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor:'#D4B2EF',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
})