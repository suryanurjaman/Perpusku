import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { launchCamera } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { updateUser } from '../../../redux/actions/UserAction';

const EditProfilePage = ({ route }) => {
    const { dataValue } = route.params;
    const [editedValue, setEditedValue] = useState({
        email: dataValue.email,
        username: dataValue.username,
        role: dataValue.role,
        imageUrl: dataValue.imageUrl
    });
    const [userId, setUserId] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // State untuk menunjukkan status loading

    console.log(dataValue.imageUrl)

    useEffect(() => {
        const fetchData = async () => {
            const user = auth().currentUser;
            if (user) {
                setUserId(user.uid);
            }
        };
        fetchData();
    }, []);

    const dispatch = useDispatch();

    const openCameraPicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchCamera(options, handleResponse);
    };

    const handleResponse = (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('Image picker error: ', response.error);
        } else {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            setEditedValue(prevState => ({
                ...prevState,
                imageUrl: imageUri // Memperbarui imageUrl di state userData
            }));
        }
    };

    const handleInputChange = (key, value) => {
        setEditedValue(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    const handleSaveChanges = async () => {
        try {
            if (!userId) {
                console.error('UserId tidak tersedia');
                return;
            }

            setIsLoading(true); // Set isLoading menjadi true saat proses penyimpanan dimulai

            // Tambahkan userId ke dalam data yang akan diperbarui
            const updatedData = {
                ...editedValue,
                userId: userId,
            };

            // Panggil aksi updateUser dengan data pengguna yang diperbarui, gambar yang dipilih, dan URL gambar lama
            await dispatch(updateUser(updatedData, editedValue.imageUrl, dataValue.imageUrl));

            setIsLoading(false); // Set isLoading menjadi false setelah penyimpanan selesai

            // Tambahkan tindakan lain yang diperlukan setelah penyimpanan berhasil (jika ada)
            // Contoh: Navigasi kembali ke layar profil

        } catch (error) {
            setIsLoading(false); // Pastikan isLoading kembali menjadi false jika terjadi kesalahan
            console.error(error);
            Alert.alert('Gagal memperbarui data');
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity onPress={openCameraPicker}>
                    <View style={styles.imageContainer}>
                        {editedValue.imageUrl ? (
                            <Image source={{ uri: editedValue.imageUrl }} style={styles.image} />
                        ) : (
                            <View style={styles.imageIcon} >
                                <Icon2 name="image" size={40} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <Text style={styles.textTitle}>Username</Text>
                    <TextInput
                        style={styles.text}
                        value={editedValue.username}
                        onChangeText={username => handleInputChange('username', username)}
                        placeholder='Username'
                    />
                    <Text style={styles.textTitle}>Email</Text>
                    <TextInput
                        style={styles.text}
                        value={dataValue.email}
                        editable={false}
                    />
                    <Text style={styles.textTitle}>Role</Text>
                    <TextInput
                        style={styles.text}
                        value={dataValue.role}
                        editable={false}
                    />

                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={handleSaveChanges} styleText={styles.buttonText} title='Ubah Profile' />
                    </View>
                </View>
                {isLoading && (
                    <ActivityIndicator size="large" color="#0000ff" />
                )}
            </View>
        </ScrollView>
    );
};

export default EditProfilePage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginTop: 20
    },
    imageContainer: {
        alignItems: 'center',
    },
    imageIcon: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#9D9D9D'
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 100,
        marginBottom: 16,
        resizeMode: 'cover'
    },
    inputContainer: {
        marginVertical: 24
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginLeft: 8
    },
    text: {
        width: 328,
        marginLeft: 8,
        fontSize: 16,
        borderBottomWidth: 0.5,
        paddingBottom: 12,
        marginBottom: 20
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        paddingVertical: 20
    }
});
