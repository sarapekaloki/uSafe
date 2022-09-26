import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";


const Settings = () => {
    const navigation = useNavigation()
    
    return(
        <View>
            <TouchableOpacity onPress={() => navigation.replace("Perfil")} > 
                <Text> boton </Text>
            </TouchableOpacity>  
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({

})
