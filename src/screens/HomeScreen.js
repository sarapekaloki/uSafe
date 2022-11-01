import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { auth } from "../../firebase";
import MainContainer from "./navigation/MainContainer";
import OwnProfile from "./OwnProfile";
import MapScreen from "./navigation/MapScreen";
import ModalInjection from "react-native/Libraries/Modal/ModalInjection";

const HomeScreen = () => {
    // const navigation = useNavigation()
    //
    // const handleSignOut = () => {
    //     auth
    //     .signOut()
    //     .then(() => {
    //         navigation.replace("Login")
    //     })
    //     .catch(error => alert(error.message))
    // }

    return(
        <OwnProfile/>
        // <View style={styles.container}>
        //
        //     <Text>Email: {auth.currentUser?.email}</Text>
        //     <TouchableOpacity
        //         onPress= {handleSignOut}
        //         style={styles.button}
        //     >
        //     <Text style={styles.buttonText}> Sign out </Text>
        //     </TouchableOpacity>
        // </View>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    button: {
        backgroundColor: "blueviolet",
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
    },
    buttonText: {
        color:'white',
        fontWeight: '700',
        fontSize: 16,
    },
})