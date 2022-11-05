import React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import {Modal} from "./Modal";
import {Button} from "./Button";
import Ionicons from "react-native-vector-icons/Ionicons";


export const MapModal = ({
                          handleModalAcceptance,
                          handleModalRejection,
                          isVisible,
                          user,
                          ...props
                      }) => {
    return (
        <Modal isVisible={isVisible}>
            <Modal.Container>

                <Modal.Header title={user.username+" necesita tu ayuda!"}
                              handleModal={handleModalRejection} />
                <Modal.Body>
                    <View style={styles.body}>
                        <View style={styles.userAttribute}>
                            <Ionicons name={'checkmark-circle'}
                                      size={22}
                                      color={'#856CC2'}
                                      style={{marginTop: '-1%'}}/>
                            <Text style={styles.text}>{user.helpResponses} responses</Text>
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
                        <Button title="ACCEPT" color='#70C053' onPress={handleModalAcceptance} width="40%"/>
                        <Button title="DECLINE" color='#EC4747' onPress={handleModalRejection} width="40%" />
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
});
