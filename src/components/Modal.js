import React from "react";
import {StyleSheet, View, Text, Platform, Image, TouchableOpacity} from "react-native";
import RNModal from "react-native-modal";

export const Modal = ({
                          isVisible = false,
                          children,
                          ...props
                      }) => {
    return (
        <RNModal
            isVisible={isVisible}
            animationInTiming={1000}
            animationOutTiming={1000}
            backdropTransitionInTiming={800}
            backdropTransitionOutTiming={800}
            {...props}>
            {children}
        </RNModal>
    );
};

const ModalContainer = ({ children }) => (
    <View style={styles.container}>{children}</View>
);

const ModalHeader = ({ title, handleModal }) => (
    <View style={styles.header}>
        <View style={styles.imageContainer}>
            <Image source={require('../../assets/brad.jpg')}
                   style={styles.image}/>
        </View>
        <View style={styles.textContainer}>
            <Text style={styles.text}>{title}</Text>
        </View>

        <TouchableOpacity onPress={handleModal}>
            <Image source={require('../../assets/cross.png')}
                   style={styles.cross}/>
        </TouchableOpacity>
    </View>
);

const ModalBody = ({ children }) => (
    <View style={styles.body}>{children}</View>
);

const ModalFooter = ({ children }) => (
    <View style={styles.footer}>{children}</View>
);

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
        justifyContent: "space-between",
        flexDirection:'row'
    },
    text: {
        paddingTop: '20%',
        textAlign: "center",
        fontSize: 18,
        fontWeight:'bold',
    },
    textContainer:{
        width: 0,
        flexGrow: 1,
        flex: 1,
    },
    body: {
        justifyContent: "center",
        paddingHorizontal: 15,
        minHeight: 100,
    },
    footer: {
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        flexDirection: "row",
    },
    cross:{
        height:30,
        width:30,
        top:'-25%',
        right:'5%'
    },
    image:{
        width: 75,
        height: 75,
        borderRadius: 100,
        resizeMode:'cover',
        overflow:'hidden',

    },
    imageContainer:{
        marginLeft:'6%',
        top:'7%',
        ...Platform.select({
            ios:{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.6,
                shadowRadius: 3,
            },
            android:{
                elevation:5
            }
        })
    }
});

Modal.Header = ModalHeader;
Modal.Container = ModalContainer;
Modal.Body = ModalBody;
Modal.Footer = ModalFooter;