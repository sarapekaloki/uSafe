import React from "react";
import {StyleSheet, View, Text, Button, Image, TouchableOpacity, Platform} from "react-native";
import {Marker} from "react-native-maps";
import {addDoc, collection, doc, getFirestore, setDoc} from "firebase/firestore";

export const OtherUserMarker = ({
                          visible,
                          user,
                          victim,
                          setFocusedUser,
                          handleModal
                      }) => {

    return (
        <View>
                <Marker
                    coordinate={(user.coordinates.latitude && user.coordinates.longitude)
                        ? user.coordinates : {latitude:0,longitude:0}}
                    onPress={
                        victim ? ()=>{handleModal();setFocusedUser(user)} : () => {}
                    }
                >
                    <View style={victim ?
                        [styles.victimContainer,visible ? {borderWidth: Platform.OS==='ios' ? 12:6} :
                            {borderWidth:0}] :
                        [styles.container, visible ? {borderWidth: 6} :
                            {borderWidth:0}]}>
                        <Image style={victim ?
                            [styles.victim,visible ? {width: Platform.OS==='ios' ? 60:35 ,height: Platform.OS==='ios' ? 60:35} :
                                {width:0,height:0}] :
                            [styles.image,visible ? {width:35,height:35} :
                                {width:0,height:0}]} source={user.pictureUrl ? {uri: user.pictureUrl} : require('../../assets/img/initial-profile-picture.jpeg') }/>
                    </View>
                </Marker>
        </View>
    );
};

const styles = StyleSheet.create({
    image:{
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    container:{
        borderColor: 'rgba(71, 106, 232, .5)',
        borderRadius: 100,
    },
    victim:{
        width: 60,
        height: 60,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    victimContainer:{
        borderColor: 'rgba(229, 67, 67, .5)',
        borderWidth: 12,
        borderRadius: 100,
    },
})

