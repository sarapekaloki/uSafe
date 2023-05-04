import React from "react";
import {Image, StyleSheet, View, TouchableOpacity} from "react-native";
import {auth} from "../../firebase";
import {useNavigation} from "@react-navigation/native";


export const ChatBubbleImage = (props) => {
    const navigation = useNavigation()

    const goToMap = ()=>{
        if(props.currentChat.members.includes(props.user.email) ||
        props.currentChat.user === props.user.email){
            const coords = props.user.coordinates;
            navigation.navigate("Mapa", {coords});
        }
    }

    return (
        <View>
            {
                !props.currentUserIsSender && props.user && !props.message.consecutive &&
                <View style={[styles.imageContainer,
                    {borderColor: props.victim === props.message.sender ?
                            'rgba(76,17,203, 0.5)' :
                            'rgba(76,17,203, 0.0)'}]}>
                    <TouchableOpacity onPress={goToMap}>
                        <Image source={props.user.pictureUrl ? {uri:props.user.pictureUrl} : require('../../assets/img/initial-profile-picture.jpeg')}
                               style={styles.image}/>
                    </TouchableOpacity>
                </View>
            }
            {
                !props.currentUserIsSender && props.user && props.message.consecutive &&
                <View style={[styles.imageContainer,{opacity:0}]}/>
            }
        </View>
    );
};
const styles = StyleSheet.create({
    image:{
        borderRadius:50,
        width: '100%',
        height: '100%',
    },
    imageContainer:{
        marginTop:20,
        margin:10,
        width: 35,
        height: 35,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: 'rgba(255, 0, 0, 0.5)',
        overflow: 'hidden',
    },
});