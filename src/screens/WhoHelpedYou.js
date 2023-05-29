import React, { useState, useEffect } from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Ionicons} from '@expo/vector-icons';

import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";
import { auth } from "../../firebase";
import {getFirestore,doc,setDoc, onSnapshot, query, collection, where} from 'firebase/firestore';
import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
} from '@expo-google-fonts/open-sans';
import {Like} from "../components/Like";
import { messagesWords } from "../lenguagesDicts/messagesWords";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { sendNotification } from "../hooks/sendNotification";


export default function WhoHelpedYou() {
    const [len, setLen] = useState('EN');
    AsyncStorage.getItem('len').then(res => {
         setLen(res)
    });
    const navigation = useNavigation();
    const route = useRoute();
    const db = getFirestore();
    const [gotInfo, setGotInfo] = useState(false);

    const [currentChat, setCurrentChat] = useState(null);

    const [members, setMembers] = useState([]);
    const [likedUsers, setLikedUsers] = useState([]);

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
    });
    async function modifyUser(likes, user) {
        const docRef = doc(db, "users", user.email);
        user = {
            coordinates:user.coordinates,
            email:user.email,
            helpRadar:user.helpRadar,
            helpResponses:user.helpResponses,
            len:user.len,
            pictureUrl:user.pictureUrl,
            token:user.token,
            username:user.username,
            likes:likes,
            reportedBy:user.reportedBy,
            reported:user.reported
        }
        await setDoc(docRef, user);
    }

    const getChatMembers = ()=>{
        const usersQuery = query(collection(db, "users"), where("email", "!=", ""));
        onSnapshot(usersQuery,  (querySnapshot) => {
            let auxMembers=[];
            querySnapshot.forEach((doc) => {
                if(currentChat.includes(doc.data().email)){
                    auxMembers.push(doc.data());
                }
            });
            setMembers(auxMembers);
        } )
    }

     function handleWhoHelpedYou() {
        likedUsers.forEach(user => {
            modifyUser(user.likes +1, user);
            sendNotification(user.email, "like", route.params.currentUser.username)
        })
        navigation.navigate('Mapa')
    }

    useEffect(()=>{
        setCurrentChat(route.params.chat);
    },[])

    useEffect(()=>{
        if(currentChat){
            getChatMembers();
        }
    },[currentChat])

    if (!fontsLoaded) {
        return null;
    }

    const renderLikes = ()=>{
        return members.map((user,index) =>{
                return (
                    !(user.reportedBy.includes(auth.currentUser.email)) &&
                    <Like
                        key={index}
                        user={user}
                        setLikedUsers={setLikedUsers}
                        likedUsers={likedUsers}
                    />
                )
            }
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <View style={styles.titleContainer}>
                    <Ionicons name={'checkmark-circle'}
                              size={24}
                              color={'#B9A7EE'}
                              style={{marginLeft: 10}}
                    />
                    <Text style={styles.title}>{messagesWords[len].whoHelpedYou}</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
                    <Text style={styles.skipButton}>{messagesWords[len].skip}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.disclaimer}>{messagesWords[len].whoHelpedYouDescription}</Text>
            <ScrollView style={styles.content}>
                {renderLikes()}
            </ScrollView>
                <TouchableOpacity style={styles.finishButton} onPress={() => handleWhoHelpedYou() }>
                    <Text style={styles.finishText}>
                    {messagesWords[len].whoHelpedYouButton}
                    </Text>
                </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    titleContainer:{
        flexDirection: 'row',
        right:10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 50,
        paddingTop: 50,
        paddingBottom: 20,
        width: '100%',
        borderBottomColor: '#E9E8EA',
        borderBottomWidth: 1,
    },
    title: {
        fontFamily: 'Spartan_700Bold',
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 10,
    },
    skipButton: {
        fontFamily: 'Spartan_600SemiBold',
        fontSize: 14,
        color: '#969696',
        right: 25,
    },
    content: {
        flex: 1,
        margin:20,
        maxHeight:'50%',
        borderColor:'rgba(0,0,0,.05)',
        borderWidth:2,
        borderRadius:10
    },
    disclaimer:{
        fontFamily: 'Spartan_500Medium',
        marginLeft:26,
        marginRight:26,
        marginTop:40,
    },
    image:{
        width: 75,
        height: 75,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    likesContainer:{
        width:'100%',
        flexDirection: 'row',
        borderBottomColor:'rgba(0,0,0,.05)',
        borderBottomWidth:2,
        padding:10,
        justifyContent:'space-between'
    },
    name:{
        margin:14,
        fontFamily: 'Spartan_700Bold',
        fontSize: 18,
    },
    likeCircle:{
        width:70,
        height:70,
        borderRadius:100,
        backgroundColor: '#FFDDFA',
        alignItems:'center',
        justifyContent:'center',

    },
    finishText:{
        fontFamily: 'Spartan_700Bold',
        color: '#fff',
        fontSize: 15,
    },
    finishButton:{
        borderRadius:50,
        width:200,
        height:60,
        backgroundColor: '#C1A7FF',
        alignItems:'center',
        justifyContent:'center',
        alignSelf:'center'
    }
})
