import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import OwnProfile from "../OwnProfile";
import { Platform, StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import Settings from "../Settings"
import MapScreen from "../MapScreen";
const Tab = createBottomTabNavigator()

const Tabs = () => {
    //cambiar esta variable para cuando sea dark
    const theme = "light"
    const backgroundColor = theme == 'light'? '#fff' : '#28194C'
    const fontColor = theme == 'light'? '#000' : '#fff'
    return (
        <Tab.Navigator initialRouteName="Mapa" screenOptions={{tabBarShowLabel: false,tabBarStyle:{
            elevation: 0,
            backgroundColor: backgroundColor,
            height: '11%',
            position: 'absolute',
            ...styles.shadow
        }
            }}>
        <Tab.Screen name="Alarma" component={OwnProfile} options={{
            tabBarIcon: ({focused}) => (
                <Image source={focused? require( '../../../assets/icons/selected-alarm-icon.png') : require( '../../../assets/icons/unselected-alarm-icon.png') } 
                        style={styles.alarm}/>

            )
        }}/>
        <Tab.Screen name="Configuración" component={Settings} options={{
            tabBarIcon: ({ focused }) => (
                <Image 
                    source={focused? require( `../../../assets/icons/${theme}-settings-selected.png`): require( `../../../assets/icons/${theme}-settings-unselected.png`)}
                    style={styles.icons}
                    />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontWeight: 'bold',
            fontSize: 25,
            right: Platform.OS == 'ios'? '55%': 0,
            color: fontColor
          }
        }}
        />
        <Tab.Screen name="Perfil" component={OwnProfile} options={{
            tabBarIcon: ({ focused }) => (
                <Image 
                    source={focused? require( `../../../assets/icons/${theme}-profile-selected.png`): require( `../../../assets/icons/${theme}-profile-unselected.png`)}
                    style={styles.icons}
                    />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontWeight: 'bold',
            fontSize: 25,
            right: Platform.OS == 'ios'? '225%': 0,
            color: fontColor
          }
        }}
        />

        <Tab.Screen name="Mapa" component={MapScreen} options={{
            tabBarIcon: ({ focused }) => (
                <Image 
                    source={focused? require( `../../../assets/icons/${theme}-map-selected.png`): require( `../../../assets/icons/${theme}-map-unselected.png`)}
                    style={styles.icons}
                    />
          ),
          headerStyle:{
            backgroundColor: backgroundColor,
          },
          headerTitleStyle:{
            fontWeight: 'bold',
            fontSize: 25,
            right: Platform.OS == 'ios'? '210%': 0,
            color: fontColor
          }
        }}
        />

        </Tab.Navigator>
    );
}
export default Tabs;

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#b0b0b0',
        shadowOffset: {
            width: 0,
            height: -3,
          },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    },
    icons: {
        width: 25,
        height: 25
    },
    alarm: {
       width: 90,
       height: 90,
       bottom: 10,
       left: 10,
       borderRadius: 50,
    }
})