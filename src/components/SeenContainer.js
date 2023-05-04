import React from "react";
import {Image, StyleSheet, View} from "react-native";
import {auth} from "../../firebase";

export const SeenContainer = (props) => {

    return (
        <View style={styles.seenContainer}>
            {
                props.message.seenBy.map((seenByUser,index) =>{
                        return (props.user && seenByUser.email !== auth.currentUser.email &&
                            <Image key={index} source={seenByUser.pictureUrl ? {uri:seenByUser.pictureUrl} : require('../../assets/img/initial-profile-picture.jpeg')}
                                   style={styles.seenPicture}/>)
                    }
                )

            }
        </View>
    );
};
const styles = StyleSheet.create({
    seenPicture:{
        marginHorizontal:2,
        marginBottom:4,
        width: 20,
        height: 20,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',
    },
    seenContainer:{
        width:'100%',
        marginTop:-2,
        flexDirection:'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
});