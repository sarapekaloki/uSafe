import React from "react";
import { useNavigation } from "@react-navigation/native";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
const Settings = () => {
    const navigation = useNavigation()

    var profileIcon = alerta
        ? require ('../../assets/icons/invProfile.png')
        : require ('../../assets/icons/profile.png');
    var settingsIcon = alerta
        ? require ('../../assets/icons/invSettingsDark.png')
        : require ('../../assets/icons/settingsDark.png');
    var mapIcon = alerta
        ? require ('../../assets/icons/invMap.png')
        : require ('../../assets/icons/map.png');
    const getColor = () =>{
        let color;
        if (alerta === false){
            color="#fff";
        }
        else if (alerta === true){
            color="#28194C";
        }
        return color;
    }

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.replace("Perfil")} > 
                <Text> boton </Text>
            </TouchableOpacity>

            <View style= {[styles.navBar,{backgroundColor:getColor()}]} >
                <TouchableOpacity onPress={()=> navigation.replace("Alert")}>
                    <Image style={styles.alertIcon} source={require('../../assets/icons/alert.png')}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarButtons} onPress={()=> navigation.replace("Configuración")}>
                    <Image style={styles.navBarSettingsIcon} source={settingsIcon}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarButtons} onPress={()=> navigation.replace("Perfil")}>
                    <Image style={styles.profileIcon} source={profileIcon}></Image>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navBarButtons} onPress={()=> navigation.replace("Map")}>
                    <Image style={styles.mapIcon} source={mapIcon}></Image>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center'
    },

    navBar:{
        width:"100%",
        height:"12%",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        position:"absolute",
        bottom:0,
        flexDirection:"row",
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .6,
        justifyContent:"space-around",
    },

    mapIcon:{
        height:30,
        width:30,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .2,
    },

    profileIcon:{
        height:38,
        width:38,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .1,
    },

    navBarSettingsIcon:{
        height:25,
        width:25,
        marginLeft:-15,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .2,
    },

    alertIcon:{
        width:200,
        height:"100%",
        marginTop:"5%",
        marginLeft:-10,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: .2,
        padding:.1,
    },

    navBarButtons:{
        height:"100%",
        justifyContent:"space-evenly",
        alignItems:"center",
        width:"15%"
    }

})
