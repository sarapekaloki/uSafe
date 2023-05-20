import React, { useState, useEffect } from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {Feather, Ionicons} from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View, ViewComponent,
    ScrollView
} from "react-native";
import { auth } from "../../firebase";
import {getFirestore, doc, onSnapshot, query, collection, where} from 'firebase/firestore';
import {
    useFonts,
    OpenSans_400Regular,
    OpenSans_500Medium,
    OpenSans_600SemiBold
} from '@expo-google-fonts/open-sans';
import {OtherUserMarker} from "../components/OtherUserMarker";
import {Like} from "../components/Like";

export default function WhoHelpedYou() {
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
                              size={26}
                              color={'#B9A7EE'}
                              style={{marginLeft: 10}}
                    />
                    <Text style={styles.title}>Who helped you</Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Mapa')}>
                    <Text style={styles.skipButton}>Skip</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.disclaimer}>Deja un like a todos los usuarios que te ayudaron durante tu alerta</Text>
            <ScrollView style={styles.content}>
                {renderLikes()}
            </ScrollView>
                <TouchableOpacity style={styles.finishButton} onPress={() => navigation.navigate('Mapa')}>
                    <Text style={styles.finishText}>
                        Terminar
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
        fontSize: 22,
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
        maxHeight:'50%',
        borderColor:'rgba(0,0,0,.05)',
        borderWidth:2,
        borderRadius:10
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
