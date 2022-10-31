import React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import {Modal} from "./Modal";
import {Button} from "./Button";
import Ionicons from "react-native-vector-icons/Ionicons";


export const MapModal = ({
                          handleModal,
                          isVisible,
                          ...props
                      }) => {
    return (
        <Modal isVisible={isVisible}>
            <Modal.Container>

                <Modal.Header title="Usuario necesita tu ayuda!"
                              handleModal={handleModal} />
                <Modal.Body>
                    <View style={styles.body}>
                        <View style={styles.userAttribute}>
                            <Ionicons name={'checkmark-circle'}
                                      size={22}
                                      color={'#856CC2'}
                                      style={{marginTop: '-1%'}}/>
                            <Text style={styles.text}>2 responses</Text>
                        </View>
                        <View style={[styles.userAttribute,
                            {marginTop: '4%'}]}>
                            <Ionicons name={'checkmark-circle'}
                                      size={22}
                                      color={'#856CC2'}
                                      style={{marginTop: '-1%'}}/>
                            <Text style={styles.text}>223m</Text>
                        </View>
                    </View>

                </Modal.Body>
                <Modal.Footer>
                    <View style={{flexDirection:'row',
                        justifyContent:'space-between',
                        width:'70%',
                        marginTop:'-10%',
                        bottom:'30%'
                    }}>
                        <Button title="ACCEPT" color='#70C053' onPress={handleModal} />
                        <Button title="DECLINE" color='#EC4747' onPress={handleModal} />
                    </View>

                </Modal.Footer>
            </Modal.Container>
        </Modal>
    );
};


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "#000",
        borderStyle: "solid",
    },
    header: {
        alignItems: "center",
        justifyContent: "center",
    },
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
    footer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        flexDirection: "row",
    },


});
