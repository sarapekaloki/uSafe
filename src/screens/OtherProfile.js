import React, { useEffect, useState, useRef } from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import { Image, StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
const screenWidth = Dimensions.get("screen").width;
import {AntDesign, Entypo, Feather, Ionicons} from '@expo/vector-icons';
import {
    useFonts,
    Spartan_500Medium,
    Spartan_400Regular,
    Spartan_600SemiBold,
    Spartan_700Bold,
    Spartan_100Thin
} from '@expo-google-fonts/spartan';

import Modal from "react-native-modal"
import {
    collection,
    deleteDoc,
    doc,
    getDocs,
    getFirestore,
    onSnapshot,
    query,
    setDoc,
    updateDoc,
    where
} from "firebase/firestore";
import {auth, firebaseConfig} from "../../firebase";
import {getCurrentUser} from "../hooks/getCurrentUser";
import firebase from "firebase/compat";

const OtherProfile = () => {
    const db = getFirestore();
    const navigation = useNavigation();
    const route = useRoute();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [gotInfo, setGotInfo] = useState(false);

    useEffect(()=>{
        if(!gotInfo){
            getCurrentUser(setCurrentUser).then();
            setGotInfo(true);
        }
    })

    let [fontsLoaded] = useFonts({
        Spartan_500Medium,
        Spartan_400Regular,
        Spartan_600SemiBold,
        Spartan_700Bold,
        Spartan_100Thin
    });

    if (!fontsLoaded) {
        return null;
    }

    async function modifyUser(user, reports) {
        const docRef = doc(db, "users", user.email);
        let modifiedUser = {
            coordinates:user.coordinates,
            email:user.email,
            helpRadar:user.helpRadar,
            helpResponses:user.helpResponses,
            len:user.len,
            pictureUrl:user.pictureUrl,
            token:user.token,
            username:user.username,
            likes:user.likes,
            reportedBy: reports,
            reported: user.reported
        }
        if(user.email === auth.currentUser.email){
            modifiedUser.reportedBy = user.reportedBy;
            modifiedUser.reported = reports;
        }
        await setDoc(docRef, modifiedUser);
    }

    const handleReport = async ()=>{
        if(currentUser){
            const reportedBy = route.params.user.reportedBy;
            const reported = currentUser.reported;
            if(!reportedBy.includes(auth.currentUser.email)){
                reportedBy.push(auth.currentUser.email);
                reported.push(route.params.user.email);
                await modifyUser(route.params.user, reportedBy).then();
                await modifyUser(currentUser, reported).then();
            }
            setIsModalVisible(false);
            navigation.goBack();
            await handleAlarm();
            await handleChat();
        }
    }

    const handleAlarm = async ()=>{
        let alarm = null;
        const reportedUser = route.params.user;
        const alarmsRef = collection(db, "alarms");
        await getDocs(alarmsRef).then((res) => {
            res.forEach((obj) => {
                alarm = obj.data();
                if(alarm.alarmingUser === reportedUser.email){
                    if(reportedUser.reportedBy.length >=3){
                        const docRef = doc(db, "alarms", alarm.alarmingUser);
                        deleteDoc(docRef);
                        navigation.navigate("Mapa");
                    }
                    else if(alarm.users.includes(auth.currentUser.email)){
                        modifyAlarm(alarm, alarm.alarmingUser, auth.currentUser.email);
                        navigation.navigate("Mapa");
                    }
                    return;
                }
                else if(alarm.alarmingUser === auth.currentUser.email){
                    modifyAlarm(alarm, auth.currentUser.email, reportedUser.email);
                    navigation.goBack();
                    return;
                }
                else if(reportedUser.reportedBy.length >=3 && alarm.users.includes(reportedUser.email)){
                    modifyAlarm(alarm, alarm.alarmingUser, reportedUser.email);
                    navigation.goBack();
                    return;
                }
            })
        });
    }

    async function modifyAlarm(alarm, reporter, reported) {
            const docRef = doc(db, "alarms", reporter);
            const auxUsers = alarm.users;
            const index = alarm.users.indexOf(reported);
            if(index !== -1){
                auxUsers.splice(index);
                let modifiedAlarm = {
                    alarmingUser: alarm.alarmingUser,
                    users:auxUsers
                }
                await setDoc(docRef, modifiedAlarm);
            }
    }

    const handleChat = async ()=>{
        let chat = null;
        const reportedUser = route.params.user;
        const chatsRef = collection(db, "chat");
        await getDocs(chatsRef).then((res) => {
            res.forEach((obj) => {
                chat = obj.data();
                if(chat.user === reportedUser.email){
                    if(reportedUser.reportedBy.length >=3){
                        const docRef = doc(db, "chat", chat.user);
                        deleteDoc(docRef);
                        navigation.navigate("Mapa");
                    }
                    else if(chat.members.includes(auth.currentUser.email)){
                        modifyChat(chat, chat.user, auth.currentUser.email);
                        navigation.navigate("Mapa");
                    }
                    return;
                }
                else if(chat.user === auth.currentUser.email){
                    modifyChat(chat, auth.currentUser.email, reportedUser.email);
                    return;
                }
                else if(reportedUser.reportedBy.length >=3 && chat.members.includes(reportedUser.email)){
                    modifyChat(chat, chat.user, reportedUser.email);
                    return;
                }
            })
        });
    }

    async function modifyChat(chat, reporter, reported) {
        const docRef = doc(db, "chat", reporter);
        const auxMembers = chat.members;
        const index = chat.members.indexOf(reported);
        if(index !== -1){
            auxMembers.splice(index);
            let modifiedChat = {
                user: chat.user,
                members:auxMembers,
                messages:chat.messages
            }
            await setDoc(docRef, modifiedChat);
        }

    }

    return (
        <View style= {styles.container}>
            <View style={styles.pinkTop}>
                <View style={styles.topButtons}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name={'arrow-back-outline'}
                            size={30}
                            color={'#FFFFFF'}
                        />
                    </TouchableOpacity>
                    <View style={styles.userNameContainer}>
                        <Text style={styles.userNameText}>{route.params.user.username}</Text>
                    </View>
                    <TouchableOpacity onPress={() => {setIsModalVisible(true)}}>
                        <Ionicons name={'ellipsis-horizontal'}
                                  size={30}
                                  color={'#FFFFFF'}
                        />
                    </TouchableOpacity>
                </View>
                <Image style={styles.image} source={route.params.user.pictureUrl !=="" ? {uri: route.params.user.pictureUrl} : require('../../assets/img/initial-profile-picture.jpeg')}></Image>
                <Modal
                    isVisible={isModalVisible}
                    onBackdropPress={() => setIsModalVisible(false)}
                    swipeDirection="down"
                    style={styles.modal}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalTop}>
                            <Feather name={'user-minus'} size={45} color={'black'}/>
                            <Text style={{
                                fontSize: 18,
                                fontFamily: 'Spartan_700Bold',
                                marginTop:10,
                                marginLeft:25
                            }}>Reportar usuario:</Text>
                        </View>
                        <View style={{margin:10}}>
                            <View style={styles.modalBullet}>
                                <View style={styles.bullet}/>
                                <Text style={styles.modalText}>Al reportarlo ya no recibirás alertas ni ayudas de este usuario. </Text>
                            </View>
                            <View style={styles.modalBullet}>
                                <View style={styles.bullet}/>
                                <Text style={styles.modalText}>Si un usuario es reportado 3 veces, su cuenta será eliminada</Text>
                            </View>
                        </View>
                        <View style={{
                            width:'100%',
                            alignItems:'center',
                            justifyContent:'center',
                            marginTop:30
                        }}>
                            <TouchableOpacity style={styles.reportButton}
                                onPress={handleReport}>
                                <Text style={styles.reportText}>
                                    Reportar
                                </Text>
                            </TouchableOpacity>
                        </View>


                    </View>
                </Modal>
            </View>
            <View style ={styles.extraInfo}>
                <View style = {styles.column}>
                    <Text style={styles.extraInfoHeader}>Likes</Text>
                    <Text style={styles.extraInfoNum}>{route.params.user.likes}</Text>
                </View>
                <View style = {styles.column}>
                    <Text style={styles.extraInfoHeader}>Help Responses</Text>
                    <Text style={styles.extraInfoNum}>{route.params.user.helpResponses}</Text>
                </View>
            </View>
        </View>

    )}

export default OtherProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    pinkTop: {
        width: '100%',
        height: 230,
        backgroundColor: '#FF66C4',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        alignItems: "center",
    },
    image:{
        width: screenWidth / 2.4,
        height: screenWidth / 2.4,
        marginTop: 50,
        marginBottom: '5%',
        borderRadius: 100
    },
    profileDetails: {
        marginTop: '30%',
        width: '80%',
        borderBottomColor: '#E9E8EA',
        borderBottomWidth: 1
    },
    userNameText:{
        fontSize: 22,
        fontFamily: 'Spartan_500Medium',
        color:'white'
    },
    userNameContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal:50,
    },
    extraInfo:{
        flexDirection:'row',
        justifyContent: 'space-between',
        fontFamily: 'Spartan_400Regular',
        paddingRight: 20,
        paddingLeft: 20,
        marginTop: '35%',
        width: '80%',
        borderBottomColor: '#E9E8EA',
        borderBottomWidth: 1,

    },
    extraInfoHeader:{
        color: '#BAB5B5',
        fontSize: 16,
        fontWeight: '400',
        marginBottom: 5

    },
    extraInfoNum: {
        fontSize: 22,
        fontWeight: '700',
    },
    column: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        marginBottom: 20
    },
    topButtons:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingTop: 60,
        width: '100%',
    },
    modal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 22,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: '50%',
    },
    modalTop:{
        flexDirection:'row',
        margin:12
    },
    bullet: {
        backgroundColor:'black',
        borderRadius:100,
        width:5,
        height:5,
        margin:9
    },
    modalText:{
        fontFamily: 'Spartan_500Medium',
        fontSize:16,
        top:2
    },
    modalBullet:{
        flexDirection:'row',
        marginVertical:10
    },
    reportButton:{
        borderRadius:25,
        backgroundColor:'#E54343',
        width: 180,
        height:60,
        justifyContent:'center',
        alignItems:'center'
    },
    reportText:{
        fontFamily:'Spartan_600SemiBold',
        fontSize:18
    }
})