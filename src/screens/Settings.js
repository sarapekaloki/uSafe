import React, {useState, useEffect} from "react";
import { useNavigation } from "@react-navigation/native";
import { Feather } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons'; 
import { FontAwesome5 } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { settingsWords } from "../lenguagesDicts/settingsWords";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { auth } from "../../firebase";
import {getFirestore, doc, onSnapshot} from 'firebase/firestore';
import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
  } from '@expo-google-fonts/open-sans';

const Settings = () => {
    const navigation = useNavigation();
    const currentEmail = auth.currentUser.email;
    const [len, setLen] = useState('EN');
    AsyncStorage.getItem('len').then(res => {
        setLen(res)
   });
    const firestore = getFirestore();
    const [currentUsername, setCurrentUsername] = useState('');  
    const [currentCoordinates, setCurrentCoordinates] = useState({});
    const [currentProfilePicture, setProfilePicture] = useState('');  
    const [helpResponses, setHelpResponses] = useState('');
    const [helpRadar, setHelpRadar] = useState(0);
    const [helpLikes, setHelpLikes] = useState(0);
    const [reported, setReported] = useState([]);
    const [reportedBy, setReportedBy] = useState([]);
    const [token, setToken] = useState('');
    const [gotInfo, setGotInfo] = useState(false);

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
      });

    useEffect(() => {
        if(!gotInfo){
            onSnapshot(doc(firestore, "users", currentEmail.toLowerCase()), (doc) => {
                if(doc.data() === undefined) return;
                setCurrentUsername(doc.data().username)
                setHelpResponses(doc.data().helpResponses)
                setProfilePicture(doc.data().pictureUrl)
                setCurrentCoordinates(doc.data().coordinates)   
                setToken(doc.data().token) 
                setHelpRadar(doc.data().helpRadar)
                setHelpLikes(doc.data().likes)
                setReported(doc.data().reported)
                setReportedBy(doc.data().reportedBy)
            });
            setGotInfo(true);
        }});
      
 
    if (!fontsLoaded) {
        return null;
    }

    return(
       
        <View style = {styles.container}>
            <View style = {styles.header}>
                <Image style = {styles.headerImg} source={require('../../assets/img/clearLogo.png')}></Image>
            </View>
            <View style = {styles.settingsBlock}>
                <View style = {styles.goBack}>
                    <TouchableOpacity  onPress={() => {navigation.goBack()} }>
                        <Entypo style = {styles.icon} name="chevron-left" size={28} color="black" />
                    </TouchableOpacity>
                    <Text style = {styles.settingsBlockTitle}>{settingsWords[len].title}</Text>
                </View>
           
                <TouchableOpacity style = {styles.configOption}  onPress = {() => navigation.navigate("Update Profile Picture", 
                    {userData:{
                        username: currentUsername,
                        email: currentEmail, 
                        coordinates: currentCoordinates,
                        helpResponses: helpResponses,
                        pictureUrl: currentProfilePicture,
                        token:token,
                        len: len,
                        helpRadar:helpRadar,
                        likes:helpLikes,
                        reportedBy:reportedBy,
                        reported:reported
                    }})}>
                     <View style={styles.leftSide}>
                        <MaterialIcons name="photo" size={24} color="#5C5C5C" />
                        <Text style = {styles.configOptionText}>{settingsWords[len].profilePicture}</Text>
                    </View>

                    <Entypo name="chevron-right" size={24} color="#5C5C5C" />
                </TouchableOpacity>

                <TouchableOpacity style = {styles.configOption} onPress={() => navigation.navigate("Update Username", 
                    {userData:{
                        username: currentUsername,
                        email: currentEmail, 
                        coordinates: currentCoordinates,
                        helpResponses: helpResponses,
                        pictureUrl: currentProfilePicture,
                        token: token,
                        helpRadar: helpRadar,
                        len: len,
                        likes:helpLikes,
                        reportedBy:reportedBy,
                        reported:reported
                    }})}>
                    <View style={styles.leftSide}>
                    <FontAwesome5 name="user-edit" size={20} color="#5C5C5C" />
                    <Text style = {styles.configOptionText}>{settingsWords[len].username}</Text>
                    </View>
                    <Entypo name="chevron-right" size={24} color="#5C5C5C" />
                </TouchableOpacity>

                <TouchableOpacity style = {styles.configOption}>
                    <View style={styles.leftSide}>
                    <MaterialCommunityIcons name="radar" size={24} color="#5C5C5C" />                    
                    <Text style = {styles.configOptionText}>{settingsWords[len].helpRadar}</Text>
                    </View>
                    <Entypo name="chevron-right" size={24} color="#5C5C5C" />
                </TouchableOpacity>
            </View>
            <View style = {styles.settingsBlock}>
                <Text style = {styles.settingsBlockTitle}>{settingsWords[len].securityConfig}</Text>
                <TouchableOpacity style = {styles.configOption} onPress={() => navigation.navigate("Update Password", {len:len})}>
                     <View style={styles.leftSide}>
                        <Feather name="lock" size={24} color="#5C5C5C" />
                        <Text style = {styles.configOptionText}>{settingsWords[len].password}</Text>
                    </View>

                    <Entypo name="chevron-right" size={24} color="#5C5C5C" />
                </TouchableOpacity>

                <TouchableOpacity style = {styles.configOption}  onPress={() => navigation.navigate("Delete Account", {len:len})}>
                    <View style={styles.leftSide}>
                    <Feather name="user-x" size={24} color="#5C5C5C" />
                    <Text style = {styles.configOptionText}>{settingsWords[len].deleteAccount}</Text>
                    </View>
                    <Entypo name="chevron-right" size={24} color="#5C5C5C" />
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
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
    settingsBlock: {
        width: '90%',
        alignItems:'flex-start',
        marginTop: 20,
        marginBottom:20
    },  
    settingsBlockTitle: {
        fontFamily:'OpenSans_600SemiBold',
        fontSize: 15,
        marginBottom: 20,
        top: 3
    },
    icon: {
        marginRight: 5
    },
    goBack:{
        flexDirection: 'row',
        justifyContent: 'center'
    },
    configOption:{
        flexDirection:'row',
        width: '100%',
        borderBottomColor: '#E9E8EA',
        borderBottomWidth: 1,
        justifyContent: 'space-between',
        alignItems:'center',
        paddingHorizontal: 10,
        height: 60

    },
    leftSide:{
        flexDirection:'row'
    },  
    configOptionText: {
        fontFamily:'OpenSans_500Medium',
        fontSize: 17,
        marginLeft:10
    }
  
})
