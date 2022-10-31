import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export const Button = ({ title, color, onPress }) => {
    return (
        <TouchableOpacity style={[styles.button,{backgroundColor: color}]}
                          onPress={onPress}>
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    button: {
        marginTop: 15,
        paddingVertical: 15,
        borderRadius: 12,
        width: "40%",
        alignItems: "center",
        shadowOffset : { width: 1, height: 2},
        shadowOpacity:.7,
        elevation:1

    },
    text: {
        color: "white",
        fontWeight: "700",
        fontSize: 16,
    },
});