import React, {useState, useEffect} from "react";
import {
    Image,
    KeyboardAvoidingView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    View
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import { MaterialCommunityIcons} from "@expo/vector-icons";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";
import { auth } from "../../firebase";
import {getFirestore, addDoc, collection} from 'firebase/firestore';
import {Base64} from "js-base64";

const RegisterScreen = () => {

    const {passwordVisibility, rightIcon, handlePasswordVisibility} =
        useTogglePasswordVisibility();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Login")
            }
        })
        return unsubscribe
    }, [])

    const handleSignUp = () => {
        if (username.length >3) {
            auth
                .createUserWithEmailAndPassword(email, password)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    console.log("Registered with: ", user.email);
                    addData();
                })
                .catch(error => alert(error.message))
        }
        else {alert("Usuario debe tener al menos 4 caracteres")}
    }

    const addData = async () => {
        const firestore = getFirestore();
        await addDoc(collection(firestore, "users"), {
            coordinates: {longitude:0,latitude:0},
            email:email,
            password:Base64.encode(password)
        });
        await addDoc(collection(firestore, "profiles"), {
            email:email,
            helpResponses: 0,
            profilePicture: "",
            username:username
        });
    }

    return(
        <KeyboardAvoidingView 
            style={styles.container}
            behavior="padding"
        >
            <Text style= {styles.headerText}>Crea una cuenta</Text>
            <ScrollView style = {styles.scrollView} >
                <View  style= {styles.whiteBox}>
                    <Image
                        style={styles.logo}
                        source={require( '../../assets/img/logoPurple.png')}
                    />
                    <View  style = {styles.inputContainer}>
                        <Text style = {styles.text} >Nombre de usuario</Text>
                        <TextInput
                            placeholder="Ingresar nombre de usuario"
                            value={username}
                            onChangeText={text => setUsername(text)}
                            style = {styles.input}
                        />
                        <Text style = {styles.text} >Correo</Text>
                        <TextInput
                            placeholder="Ingresar correo"
                            value={email}
                            onChangeText={text => setEmail(text)}
                            style = {styles.input}
                        />
                        <Text style = {styles.text}>Contraseña</Text>
                        <View  style={styles.passwordContainer}>
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
                        style = {styles.button}
                        onPress={handleSignUp}
                    >
                        <Text style = {styles.buttonText}>Registrar cuenta</Text>
                    </TouchableOpacity>


                    <View  style={styles.registerText}>
                        <Text>Ya tienes cuenta? </Text>
                        <Text style={{color: 'blue'}}
                              onPress={() => navigation.replace("Login")}>
                            Inicia sesión
                        </Text>
                    </View>
                </View>
            </ScrollView>


        </KeyboardAvoidingView>

    )
}

export default RegisterScreen

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
        width:"100%"
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
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 10,

    },
    whiteBox:{
        backgroundColor:'white',
        width:'100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
})
