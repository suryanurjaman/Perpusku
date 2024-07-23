import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import PasswordField from '../TextInput/PasswordInputComponent';
import { useDispatch } from 'react-redux';
import { deleteUser } from '../../redux/actions/AuthAction';
import { useNavigation } from '@react-navigation/native';

const ConfirmDeleteModalComponent = ({ visible, hideModal, dataValue }) => {
    console.log('confirm data value :', dataValue)
    const dispatch = useDispatch()
    const [password, setPassword] = useState('');
    const navigation = useNavigation();

    const handleConfirmDelete = async () => {
        try {
            await dispatch(deleteUser(dataValue, password, navigation));
        } catch (error) {
            console.error('Error deleting user:', error);
            // Handle error if needed
        }
    };

    return (
        <Modal visible={visible} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Konfirmasi Penghapusan Akun</Text>
                    <Text>Masukkan password Anda untuk melanjutkan:</Text>
                    <View style={styles.inputContainer}>
                        <PasswordField
                            stylesTextInput={styles.input}
                            placeholder="Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={hideModal} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirmDelete} style={[styles.button, styles.deleteButton]}>
                            <Text style={styles.buttonText}>Hapus Akun</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default ConfirmDeleteModalComponent

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        fontSize: 20,
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        width: 'auto',
        paddingVertical: 0,
        marginTop: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginLeft: 10,
    },
    cancelButton: {
        backgroundColor: '#747474',
    },
    deleteButton: {
        backgroundColor: 'tomato',
    },
    buttonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
})