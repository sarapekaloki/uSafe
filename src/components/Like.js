import React, {useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, Vibration, View} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import * as Haptics from 'expo-haptics';
import {useNavigation} from "@react-navigation/native";

export const Like = ({ user, likedUsers, setLikedUsers}) => {

    const [color, setColor ] = useState('#FFDDFA');
    const navigation = useNavigation();



    const handleLikePress = async ()=>{
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        if(color === '#FFDDFA'){
            setColor('#FF70E8');
            setLikedUsers(likedUsers => [...likedUsers, user])
            // await modifyUser(user.likes+1).then();
        }
        else{
            setColor('#FFDDFA');
            const copyLikedUsers = [...likedUsers];
            copyLikedUsers.splice(copyLikedUsers.indexOf(user), 1);
            setLikedUsers(copyLikedUsers);
            // setLikedUsers( console.log(user)}))
      
            // await modifyUser(user.likes-1).then();
        }
    }

    return (
        <View style={styles.likesContainer}>
            <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>{
                    navigation.navigate('OtherProfile',{user})
                }}>
                    <Image source={user.pictureUrl ? {uri:user.pictureUrl} : require('../../assets/img/initial-profile-picture.jpeg')}
                           style={styles.image}/>
                </TouchableOpacity>

                <Text style={styles.name}>{user.username.split(' ')[0]}</Text>
            </View>
            <TouchableOpacity onPress={handleLikePress} style={[styles.likeCircle,{backgroundColor: color}]}>
                <Ionicons name={'heart'}
                          size={30}
                          color={'#FFFFFF'}
                />
            </TouchableOpacity>
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
        alignSelf: 'center',
        fontFamily: 'Spartan_600SemiBold',
        fontSize: 18,
    },
    likeCircle:{
        width:70,
        height:70,
        borderRadius:100,
        alignItems:'center',
        justifyContent:'center',
    }
});