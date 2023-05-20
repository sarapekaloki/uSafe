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
import { Ionicons } from '@expo/vector-icons'; 
import * as Notifications from 'expo-notifications';
import {useNavigation, useRoute} from "@react-navigation/native";
import {useTogglePasswordVisibility} from "../hooks/useTogglePasswordVisibility";
import { auth } from "../../firebase";
import {getFirestore, setDoc, doc} from 'firebase/firestore';
import { registerWords } from "../lenguagesDicts/registerWords";
import {
    useFonts,
    Roboto_700Bold,
    Roboto_400Regular
  } from '@expo-google-fonts/roboto';
  
const RegisterScreen = () => {
    const route = useRoute();
    const len = route.params.len;
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

    let [fontsLoaded] = useFonts({
        Roboto_700Bold,
        Roboto_400Regular
    });

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
    }      

    const addData =  async() => {
        const token = await registerForPushNotificationsAsync();
        const firestore = getFirestore();
        const docRefUsers = doc(firestore, "users", email.toLowerCase());
        const docRefNotif = doc(firestore, "notifications", email.toLowerCase());
        const usersData = {
            coordinates: {longitude:0, latitude:0},
            email: email.toLowerCase(),
            helpResponses: 0,
            pictureUrl: "",
            username: username,
            token: token,
            helpRadar: 100,
            len: len
        };
        const notificationsData = {
            "notifications": []
        }
        await setDoc(docRefUsers, usersData);
        await setDoc(docRefNotif, notificationsData);
        navigation.navigate("MainFirstTimeSetUp", {userData: usersData})
    }

    if (!fontsLoaded) {
        return null;
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
                <Text style= {styles.headerText}>{registerWords[len].title}</Text>
                    <View  style = {styles.inputContainer}>
                        <Text style = {styles.text} >{registerWords[len].username}</Text>
                        <TextInput
                            value={username}
                            onChangeText={text => setUsername(text)}
                            style = {styles.input}
                            maxLength={15}
                        />
                <Text style =  {usernameErrorOccurs? styles.errorText: {display: 'none'}}> {registerWords[len].inputEmptyError} </Text>
                <Text style = {styles.text} >{registerWords[len].email}</Text>
                <TextInput
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style = {styles.input}
                />
                <Text style =  {emptyEmailErrorOccurs? styles.errorText: {display: 'none'}}> {registerWords[len].inputEmptyError} </Text>
                <Text style =  {invalidEmailErrorOccurs? styles.errorText: {display: 'none'}}> {registerWords[len].invalidEmailError} </Text>
                <Text style =  {repeatedEmailErrorOccurs? styles.errorText: {display: 'none'}}> {registerWords[len].alreadyExistsEmailError} </Text>
                <Text style = {styles.text}>{registerWords[len].password}</Text>
                <View  style={styles.passwordContainer}>
                    <TextInput
                        value={password}
                        onChangeText={text => setPassword(text)}
                        style = {styles.input}
                        secureTextEntry={passwordVisibility}
                    />
                    <Pressable onPress={handlePasswordVisibility} style={{right:30,top:5}}>
                        <Ionicons name={rightIcon} size={24} color="grey" />
                    </Pressable>
                </View>
                <Text style =  {emptyPasswordErrorOccurs? styles.errorText: {display: 'none'}}> {registerWords[len].inputEmptyError} </Text>
                <Text style =  {lenPasswordErrorOccurs? styles.errorText: {display: 'none'}}>{registerWords[len].lenError} </Text>
                <Text style =  {lenPasswordFixOccurs? styles.fixErrorText: {display: 'none'}}>{registerWords[len].lenError} </Text>
                <Text style =  {lowerPasswordErrorOccurs? styles.errorText: {display: 'none'}}>{registerWords[len].capsError}</Text>
                <Text style =  {lowerPasswordFixOccurs? styles.fixErrorText: {display: 'none'}}>{registerWords[len].capsError}</Text>
                <Text style =  {numberPasswordErrorOccurs? styles.errorText: {display: 'none'}}>{registerWords[len].numError} </Text>
                <Text style =  {numberPasswordFixOccurs? styles.fixErrorText: {display: 'none'}}>{registerWords[len].numError} </Text>
            </View>

            <TouchableOpacity
                style = {styles.button}
                onPress={handleSignUp}
            >
                <Text style = {styles.buttonText}>{registerWords[len].title}</Text>
                <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>

            <View  style={styles.registerText}>
                <Text>{registerWords[len].accountQuestion}</Text>
                <Text style={{color: 'blue'}}
                        onPress={() => navigation.navigate("Login")}>
                    {registerWords[len].login}
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
    headerText:{
        fontFamily: 'Roboto_700Bold',
        fontSize: 26,
        marginBottom: 10,
        justifyContent: 'center'
    },
    input: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginTop: 10,
        height: 40,
        width:"100%",
        borderBottomWidth: 1.5,
        borderBottomColor: '#672BF5'
    },
    inputContainer: {
        width: '80%'
    },
    logo: {
        width: 230,
        height: 230,
        marginTop: '20%',
        marginBottom: 30
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
        fontFamily: 'Roboto_700Bold',
        fontSize: 15,
        marginTop: 15,
        marginBottom: 5

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
