import React, {useEffect, useState} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, TouchableOpacityComponent, View} from "react-native";

export const ChatBubble = (props) => {

    return (
        <View style={
            [styles.bubble, props.currentUserIsSender ? styles.right : [
                styles.left,{backgroundColor:
                        props.senderIsVictim ?
                            '#4C11CB':
                            'black'}
            ],
            ]
        }>
            <TouchableOpacity onPress={
                ()=>{
                    props.setDateVisible(!props.dateVisible)}
            }>
                <Text style={[styles.text, props.currentUserIsSender ? styles.textRight : styles.textLeft]}>
                    {props.message.content}
                </Text>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    touchableOpacity:{
        padding:10
    },
    bubble: {
        maxWidth: '80%',
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    left: {
        backgroundColor: '#4C11CB',
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 0,
    },
    right: {
        backgroundColor: '#EBEAEA',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
    text: {
        fontSize: 16,
        color: '#fff',
        lineHeight: 22,
        flex:1,
        flexWrap:'wrap'
    },
    textLeft:{
        color:'white'
    },
    textRight:{
        color:'black'
    }
});