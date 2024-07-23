import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import React, { useState } from 'react';
import TextInputComponent from '../../../components/TextInput/TextInputComponent';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import { useDispatch } from 'react-redux';
import { addSiswa } from '../../../redux/actions/UserAction';

const AddSiswa = () => {
    const dispatch = useDispatch();
    const [userData, setUserData] = useState({
        nis: '',
        namaSiswa: '',
    });

    const handleInputChange = (key, value) => {
        if (key === 'nis' && value.length > 8) {
            return; // Do not update state if input exceeds 8 characters
        }
        setUserData({ ...userData, [key]: value });
    };

    const validateNIS = (nis) => {
        const regex = /^\d{8}$/; // 8 digit angka
        return regex.test(nis);
    };

    const handleAddUser = async () => {
        const { nis, namaSiswa } = userData;

        if (!validateNIS(nis)) {
            Alert.alert('Invalid NIS', 'NIS harus 8 digit nomor.');
            return;
        }

        if (!namaSiswa) {
            Alert.alert('Invalid Data', 'Nama Siswa tidak boleh kosong.');
            return;
        }

        try {
            await dispatch(addSiswa(userData));
            console.log('User data berhasil di input:', userData);
        } catch (error) {
            console.error('Gagal menginput data:', error);
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Text style={styles.textTitle}>NIS</Text>
                    <TextInputComponent
                        value={userData.nis}
                        onChangeText={(value) => handleInputChange('nis', value)}
                        placeholder='NIS'
                        keyboardType='numeric' // Hanya angka
                    />
                    <Text style={styles.textTitle}>Nama Siswa</Text>
                    <TextInputComponent
                        value={userData.namaSiswa}
                        onChangeText={(value) => handleInputChange('namaSiswa', value)}
                        placeholder='Nama Siswa'
                    />
                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={handleAddUser} styleText={styles.buttonText} title='Input Data' />
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default AddSiswa;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    inputContainer: {
        marginVertical: 24,
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 12,
        marginLeft: 8,
    },
    buttonContainer: {
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        paddingVertical: 20,
    },
});
