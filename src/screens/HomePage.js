import React from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View, Image } from "react-native";

const HomePage = () => {
    const navigation = useNavigation()

    setTimeout(() => {
        navigation.replace("Map Screen");
      }, 2500)

    return(
        <View style={styles.container}>
            <Image
                style={styles.logo}
                source={require( '../../assets/img/logoWhite.png')}
            />
        </View>
    )
}

export default HomePage

const styles = StyleSheet.create({
    container:{
        width: '100%',
        height: '100%',
        backgroundColor: '#D4B2EF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo:{
        width: 300,
        height: 300,
    }   
})