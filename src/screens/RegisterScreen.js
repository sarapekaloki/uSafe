import React, {useState} from "react";
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
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";
import {useNavigation} from "@react-navigation/native";
import { MaterialCommunityIcons} from "@expo/vector-icons";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";
import { auth } from "../../firebase";
import {getFirestore, setDoc, doc} from 'firebase/firestore';

const RegisterScreen = () => {

    const {passwordVisibility, rightIcon, handlePasswordVisibility} =
        useTogglePasswordVisibility();

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const [usernameErrorOccurs, usernamesetError] = useState(false)
    const [emptyEmailErrorOccurs, emptyEmailsetError] = useState(false)
    const [invalidEmailErrorOccurs, invalidEmailsetError] = useState(false)
    const [repeatedEmailErrorOccurs, repeatedEmailsetError] = useState(false)
    const [emptyPasswordErrorOccurs, emptyPasswordsetError] = useState(false)
    const [lenPasswordErrorOccurs, lenPasswordsetError] = useState(false)
    const [lowerPasswordErrorOccurs, lowerPasswordsetError] = useState(false)
    const [numberPasswordErrorOccurs, numberPasswordsetError] = useState(false)
    const [lenPasswordFixOccurs, lenPasswordsetFix] = useState(false)
    const [lowerPasswordFixOccurs, lowerPasswordsetFix] = useState(false)
    const [numberPasswordFixOccurs, numberPasswordsetFix] = useState(false)

    const handleSignUp = () => {
        let numberReg = /\d/;
        let emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
        let passwordReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        invalidEmailsetError(false);
        emptyEmailsetError(false);
        lenPasswordsetFix(false);
        lowerPasswordsetFix(false);
        numberPasswordsetFix(false);
        repeatedEmailsetError(false);
        if (username.length == 0){
            usernamesetError(true)
        }
        else {usernamesetError(false);}
        if (email.length == 0){
            emptyEmailsetError(true);
        }
        else if (emailReg.test(email) === false){
            invalidEmailsetError(true);
        }
        if (password.length == 0){
            emptyPasswordsetError(true);
        }
        else{
            emptyPasswordsetError(false);
            if (password.length < 8){
                lenPasswordsetError(true);
            }
            else
            {
                lenPasswordsetError(false);
                lenPasswordsetFix(true);
            }
            if (password.toUpperCase() == password || password.toLowerCase() == password){
                lowerPasswordsetError(true)
            }
            else
            {
                lowerPasswordsetError(false);
                lowerPasswordsetFix(true);
            }
            if (numberReg.test(password)===false){
                numberPasswordsetError(true)
            }
            else
            {
                numberPasswordsetError(false);
                numberPasswordsetFix(true);
            }
        }
        if (username.length>0 && emailReg.test(email) === true && passwordReg.test(password) ===true)
        {
            auth
                .createUserWithEmailAndPassword(email, password)
                .then(userCredentials => {
                    const user = userCredentials.user;
                    user.sendEmailVerification();
                    addData();
                    navigation.replace("Login");
                })
                .catch(error =>{
                    if (error.code === 'auth/email-already-in-use' ) {
                        repeatedEmailsetError(true);
                    }
                })
        }
    }
    async function registerForPushNotificationsAsync() {
        let token;
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        return token;
        
      
        // if (Platform.OS === 'android') {
        //   Notifications.setNotificationChannelAsync('default', {
        //     name: 'default',
        //     importance: Notifications.AndroidImportance.MAX,
        //     vibrationPattern: [0, 250, 250, 250],
        //     lightColor: '#FF231F7C',
        //   });
        // }
    }      

    const addData =  async() => {
        const token = await registerForPushNotificationsAsync();
        const firestore = getFirestore();
        const docRef = doc(firestore, "users2", email.toLowerCase());
        const data = {
            coordinates: {longitude:0, latitude:0},
            email: email.toLowerCase(),
            helpResponses: 0,
            pictureUrl: "",
            username: username,
            token: token
        };
        await setDoc(docRef, data);
    }

    return(
        <KeyboardAvoidingView 
            behavior="padding"
        >
        <View>
            <ScrollView style = {styles.scrollView} >
            <View  style= {styles.whiteBox}>
            <Image
                style={styles.logo}
                source={require( '../../assets/img/logoPurple.png')}
            />
                <Text style= {styles.headerText}>Registrate</Text>
                    <View  style = {styles.inputContainer}>
                        <Text style = {styles.text} >Nombre de usuario</Text>
                        <TextInput
                            placeholder="Ingresar nombre de usuario"
                            value={username}
                            onChangeText={text => setUsername(text)}
                            style = {styles.input}
                            maxLength={15}
                        />
                <Text style =  {usernameErrorOccurs? styles.errorText: {display: 'none'}}> Este campo no puede estar vac??o </Text>
                <Text style = {styles.text} >Correo</Text>
                <TextInput
                    placeholder="Ingresar correo"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style = {styles.input}
                />
                <Text style =  {emptyEmailErrorOccurs? styles.errorText: {display: 'none'}}> Este campo no puede estar vac??o </Text>
                <Text style =  {invalidEmailErrorOccurs? styles.errorText: {display: 'none'}}> Por favor ingresa un correo v??lido </Text>
                <Text style =  {repeatedEmailErrorOccurs? styles.errorText: {display: 'none'}}> Ya existe una cuenta con este correo </Text>
                <Text style = {styles.text}>Contrase??a</Text>
                <View  style={styles.passwordContainer}>
                    <TextInput
                        placeholder="Ingresar contrase??a"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style = {styles.input}
                        secureTextEntry={passwordVisibility}
                    />
                    <Pressable onPress={handlePasswordVisibility} style={{left:5, top:5}}>
                        <MaterialCommunityIcons name={rightIcon} size={22} color="#232323"/>
                    </Pressable>
                </View>
                <Text style =  {emptyPasswordErrorOccurs? styles.errorText: {display: 'none'}}> Este campo no puede estar vac??o </Text>
                <Text style =  {lenPasswordErrorOccurs? styles.errorText: {display: 'none'}}>1. Longitud de m??nimo 8 caracteres </Text>
                <Text style =  {lenPasswordFixOccurs? styles.fixErrorText: {display: 'none'}}>1. Longitud de m??nimo 8 caracteres </Text>
                <Text style =  {lowerPasswordErrorOccurs? styles.errorText: {display: 'none'}}>2. Contener m??nimo una may??scula y una min??scula </Text>
                <Text style =  {lowerPasswordFixOccurs? styles.fixErrorText: {display: 'none'}}>2. Contener m??nimo una may??scula y una min??scula </Text>
                <Text style =  {numberPasswordErrorOccurs? styles.errorText: {display: 'none'}}>3. Contener por lo menos un n??mero </Text>
                <Text style =  {numberPasswordFixOccurs? styles.fixErrorText: {display: 'none'}}>3. Contener por lo menos un n??mero </Text>
            </View>

            <TouchableOpacity
                style = {styles.button}
                onPress={handleSignUp}
            >
                <Text style = {styles.buttonText}>Registrar cuenta</Text>
            </TouchableOpacity>

            <View  style={styles.registerText}>
                <Text>??Ya tienes cuenta? </Text>
                <Text style={{color: 'blue'}}
                        onPress={() => navigation.replace("Login")}>
                    Iniciar sesi??n
                </Text>
                </View>
                </View>
            </ScrollView>
        </View>
        </KeyboardAvoidingView>

    )
}

export default RegisterScreen

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        backgroundColor:'#914FFC',
        width: '80%',
        padding: 15,
        borderRadius: 10,
        elevation:10
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    headerText:{
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 10,
        color: '#28194C',
        justifyContent: 'center'
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 10,
        height: 40,
        width:"100%",
        borderWidth: 1,
        borderColor: '#CFCFCF'
    },
    inputContainer: {
        width: '80%',
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
    errorText: {
        paddingTop: 5,
        color: 'red',
    },
    fixErrorText: {
        paddingTop: 5,
        color: '#70C053',
    },
    scrollView: {
        backgroundColor:'white',
        width:'100%',
        height:'100%',
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
