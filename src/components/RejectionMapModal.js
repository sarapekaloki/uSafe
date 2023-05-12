import React from "react";
import {StyleSheet, View} from "react-native";
import {Modal} from "./Modal";
import {Button} from "./Button";
import { rejectMapModalWords } from "../lenguagesDicts/rejectMapModalWords";

export const RejectionMapModal = ({
                             handleModal,
                             cancelAlarm,
                             isVisible,
                             user,
                             len,
                             ...props
                         }) => {
    return (
        <Modal isVisible={isVisible}>
            <Modal.Container>

                <Modal.Header title={rejectMapModalWords[len].title+
                    user.username}
                              handleModal={handleModal} user={user} />
                <Modal.Body>
                    <View style={styles.body}>
                        <Button
                            title={rejectMapModalWords[len].button}
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
