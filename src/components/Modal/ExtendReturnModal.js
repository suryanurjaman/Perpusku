import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet } from 'react-native';

const ExtendReturnModal = ({ visible, onClose, onExtend }) => {
    const [days, setDays] = useState('');

    const handleExtend = () => {
        const numberOfDays = parseInt(days, 10);
        if (!isNaN(numberOfDays) && numberOfDays > 0) {
            onExtend(numberOfDays);
            setDays('');
        } else {
            alert('Please enter a valid number of days.');
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Extend Return Period</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter number of days"
                        keyboardType="numeric"
                        value={days}
                        onChangeText={setDays}
                    />
                    <Button title="Extend" onPress={handleExtend} />
                    <Button title="Cancel" onPress={onClose} color="red" />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    input: {
        width: '100%',
        padding: 10,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default ExtendReturnModal;
