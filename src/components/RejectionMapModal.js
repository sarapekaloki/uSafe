import React from "react";
import {StyleSheet, View, Text, Image, TouchableOpacity} from "react-native";
import {Modal} from "./Modal";
import {Button} from "./Button";
import Ionicons from "react-native-vector-icons/Ionicons";


export const RejectionMapModal = ({
                             handleModal,
                             cancelAlarm,
                             isVisible,
                             user,
                             ...props
                         }) => {
    return (
        <Modal isVisible={isVisible}>
            <Modal.Container>

                <Modal.Header title={"Aceptaste el pedido de ayuda de "+
                    user.username}
                              handleModal={handleModal} user={user} />
                <Modal.Body>
                    <View style={styles.body}>
                        <Button
                            title="DEJAR DE AYUDAR"
                            color='#EC4747'
                            onPress={cancelAlarm}
                            width="90%"
                        />
                    </View>
                </Modal.Body>
                <Modal.Footer>
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
        marginLeft:'27%',
    },
    userAttribute:{
        flexDirection: "row",
    },
});
