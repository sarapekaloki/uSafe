import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import firebase from "firebase/compat";
import {auth} from "../../firebase";
import {collection, getDocs, getFirestore} from "firebase/firestore";
import {formatDate} from "../hooks/formatMessageDate";
import {setRandomColor} from "../hooks/setRandomColor"
import {ChatBubble} from "./ChatBubble";
import {SeenContainer} from "./SeenContainer";
import {ChatBubbleImage} from "./ChatBubbleImage";

export const Message = (props) => {
    const db = getFirestore();
    const usersRef = collection(db, "users");

    let [user, setUser] = useState(null);
    const [dateVisible, setDateVisible] = useState(false);

    const currentUserIsSender = props.message.sender === auth.currentUser.email;
    const senderIsVictim = props.victim === props.message.sender;

    useEffect(()=>{
        hourShouldDisplay();
    },[])

    useEffect(()=>{
        getDocs(usersRef).then((res) => {
            res.forEach((doc) => {
                if(doc.data().email === props.message.sender){
                    setUser(doc.data());
                }
            })
        });
    },[])

    useEffect(()=>{
    },[user]);

    const hourShouldDisplay = ()=>{
        const index = props.currentChat.messages.indexOf(props.message);
        if(index>0){
            const difference = Math.abs(props.message.time - props.currentChat.messages[index-1].time);
            const hours = difference / (1000 * 60 * 60);
            return hours > 3;
        }
        return true;
    }

    return (
        <View style={{marginBottom: props.message.consecutive ?
                currentUserIsSender ? 0 : -6
                : 12}}>
            {
                (dateVisible || hourShouldDisplay()) &&
                <Text style={[styles.date]}>{formatDate(props.message.time)}</Text>
            }
            {
                !currentUserIsSender && user && props.message.first &&
                <Text style={
                    [styles.name,senderIsVictim ?
                        {color:'#4C11CB',fontSize: 14} :
                        {color:setRandomColor(props.message.sender),fontSize: 12}
                    ]}>
                    {user.username.split(" ")[0]}
                </Text>
            }
            <View style={[styles.container,currentUserIsSender ? {alignSelf: 'flex-end'} : {alignSelf: 'flex-start'}]}>

                <View>
                    <ChatBubbleImage
                        currentUserIsSender={currentUserIsSender}
                        senderIsVictim={senderIsVictim}
                        user={user}
                        message={props.message}
                        victim={props.victim}
                        currentChat={props.currentChat}
                    />
                </View>
                    <ChatBubble
                        message={props.message}
                        victim={props.victim}
                        setDateVisible={setDateVisible}
                        dateVisible={dateVisible}
                        currentUserIsSender={currentUserIsSender}
                        senderIsVictim={senderIsVictim}
                    />
            </View>
            <SeenContainer user={user} message={props.message}/>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name:{
        marginLeft:62,
        marginBottom:3,
    },
    date:{
        textAlign: 'center',
        textAlignVertical: 'center',
        marginVertical:10,
        opacity:.4
    }
});