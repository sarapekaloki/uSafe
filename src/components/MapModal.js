import React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import {Modal} from "./Modal";
import {Button} from "./Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import {getPreciseDistance} from "geolib";
import { Entypo } from '@expo/vector-icons';
import { mapModalWords } from "../lenguagesDicts/mapModalWords";


export const MapModal = ({
                          handleModalAcceptance,
                          handleModalRejection,
                          isVisible,
                          user,
                          loggedUser,
                          len,
                          ...props
                      }) => {
    return (
        <Modal isVisible={isVisible}>
            <Modal.Container>
                <Modal.Header title={ (len =="ES"? "¡": "") +(user.username ? user.username.split(" ")[0] : user.username)+ mapModalWords[len].title}

                              handleModal={handleModalRejection}
                              user={user}/>
                <Modal.Body>
                    <View style={styles.body}>
                        <View style={styles.userAttribute}>
                            <Ionicons name={'checkmark-circle-outline'}
                                      size={22}
                                      color={'black'}
                                      style={{marginTop: '-1%'}}/>

                            <Text style={styles.text}>{mapModalWords[len].helpResponses} {user.helpResponses}</Text>
                        </View>
                        <View style={[styles.userAttribute,
                            {marginTop: '4%'}]}>
                            <Entypo name="location-pin" size={24} color="black" style={styles.icons} />
                            <Text style={styles.text}>
                                {loggedUser && user.coordinates ?
                                    getPreciseDistance(
                                        user.coordinates,
                                        loggedUser.coordinates
                                ) : 0}m
                            </Text>
                        </View>
                    </View>

                </Modal.Body>
                <Modal.Footer>
                    <View style={{flexDirection:'row',
                        justifyContent:'space-between',
                        width:'85%',
                        marginTop:'-10%',
                        bottom:'30%'
                    }}>
                        <Button title={mapModalWords[len].accept} color='#75D5A7' onPress={handleModalAcceptance} width="40%"/>
                        <Button title={mapModalWords[len].decline} color='#EC4747' onPress={handleModalRejection} width="40%" />
                    </View>

                </Modal.Footer>
            </Modal.Container>
        </Modal>
    );
};


const styles = StyleSheet.create({
    text: {
        textAlign: "center",
        fontSize: 14,
    },
    body: {
        justifyContent: "center",
        marginLeft:'30%',
        marginTop:'-8%',
        paddingHorizontal: 15,
        minHeight: 100,
    },
    userAttribute:{
        flexDirection: "row",
    },
    icons: {
        width: 23,
        height: 23,
        marginTop:"-2%",
    },
});
