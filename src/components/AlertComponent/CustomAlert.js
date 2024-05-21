import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';

const CustomAlert = ({ visible, message, onClose, successImage, failureImage }) => {
    if (!visible) return null;

    return (
        <View style={styles.container}>
            <View style={styles.alert}>
                {successImage && (
                    <Image source={successImage} style={styles.image} />
                )}
                {failureImage && (
                    <Image source={failureImage} style={styles.image} />
                )}
                <Text>{message}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    alert: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    image: {
        width: 50,
        height: 50,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
    },
    closeText: {
        color: 'blue',
        fontWeight: 'bold',
    },
});

export default CustomAlert;
