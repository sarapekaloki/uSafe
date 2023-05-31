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
import {getFirestore, onSnapshot, query, collection, where} from 'firebase/firestore';
import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
} from '@expo-google-fonts/open-sans';
import {ChatMember} from "../components/ChatMember";
import {getCurrentUser} from "../hooks/getCurrentUser";

export default function ChatMembers() {
    const navigation = useNavigation();
    const route = useRoute();
    const db = getFirestore();
    const [gotInfo, setGotInfo] = useState(false);

    const [currentChat, setCurrentChat] = useState(null);

    const [members, setMembers] = useState([]);
    const [likedUsers, setLikedUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    let [fontsLoaded] = useFonts({
        OpenSans_400Regular,
        OpenSans_500Medium,
        OpenSans_600SemiBold
    });

    useEffect(()=>{
        getCurrentUser(setCurrentUser).then();
    },[]);

    const getChatMembers = ()=>{
        const usersQuery = query(collection(db, "users"), where("email", "!=", ""));
        onSnapshot(usersQuery,  (querySnapshot) => {
            let auxMembers=[];
            querySnapshot.forEach((doc) => {
                if(currentChat.members.includes(doc.data().email)){
                    auxMembers.push(doc.data());
                }
                if(currentChat.user === doc.data().email && doc.data().email){
                    auxMembers.unshift(doc.data());
                }
            });
            setMembers(auxMembers);
        } )
    }

    useEffect(()=>{
        setCurrentChat(route.params.currentChat);
    },[])

    useEffect(()=>{
        if(currentChat){
            getChatMembers();
        }
    },[currentChat])

    if (!fontsLoaded) {
        return null;
    }

    const renderMembers = ()=>{
        return members.map((user,index) =>{
                return (
                    !(user.reportedBy.includes(auth.currentUser.email)) &&
                    !user.reported.includes(auth.currentUser.email) &&
                    !(currentUser.reportedBy.includes(user.email)) &&
                    !currentUser.reported.includes(user.email) &&
                    <ChatMember
                        key={index}
                        user={user}
                    />
                )
            }
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style= {{marginLeft: 35}} name={'arrow-back-outline'}
                              size={25}
                              color={'black'}
                    />
                </TouchableOpacity>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{route.params.chatTitle}</Text>
                </View>
            </View>
            {
                currentUser &&
                <ScrollView style={styles.content}>
                    {renderMembers()}
                </ScrollView>
            }
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
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        right: 35
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
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
        fontFamily: 'Spartan_700Bold',
        fontSize: 14,
        color: '#969696',
        marginRight: 40,
    },
    content: {
        flex: 1,
        margin:20,
        borderBottomColor:'rgba(0,0,0,.05)',
        borderBottomWidth:2,
    },
    disclaimer:{
        fontFamily: 'Spartan_700Bold',
        opacity:.6,
        marginLeft:26,
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
        fontSize: 18,
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
