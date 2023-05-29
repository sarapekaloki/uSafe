import React, {useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, Vibration, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {doc, getFirestore, onSnapshot, setDoc} from "firebase/firestore";
import * as Haptics from 'expo-haptics';
import {useNavigation} from "@react-navigation/native";
import {auth} from "../../firebase";

export const ChatMember = ({ user }) => {

    const [color, setColor ] = useState('#FFDDFA');
    const db = getFirestore();
    const navigation = useNavigation();

    async function modifyUser(likes) {
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

    const handleLikePress = async ()=>{
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if(color === '#FFDDFA'){
            setColor('#FF70E8');
            await modifyUser(user.likes+1).then();
        }
        else{
            setColor('#FFDDFA');
            await modifyUser(user.likes-1).then();
        }
    }

    return (
        <View style={styles.membersContainer}>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>{
                    if(user.email === auth.currentUser.email){
                        navigation.navigate('Perfil');
                    }
                    else{
                        navigation.navigate('OtherProfile',{user})
                    }
                }}>
                    <Image source={user.pictureUrl ? {uri:user.pictureUrl} : require('../../assets/img/initial-profile-picture.jpeg')}
                           style={styles.image}/>
                </TouchableOpacity>

                <Text style={styles.name}>{user.email === auth.currentUser.email ? 'Tú' : user.username}</Text>
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    image:{
        width: 75,
        height: 75,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',

    },
    membersContainer:{
        width:'100%',
        flexDirection: 'row',
        borderBottomColor:'rgba(0,0,0,.05)',
        borderBottomWidth:1,
        padding:10,
        justifyContent:'space-between'
    },
    name:{
        margin:14,
        fontFamily: 'Spartan_600SemiBold',
        alignSelf: 'center',
        fontSize: 18,
    }
});