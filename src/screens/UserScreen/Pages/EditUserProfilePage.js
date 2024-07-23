import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { launchCamera } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { EditProfile } from '../../../redux/actions/AuthAction';
import { useNavigation } from '@react-navigation/native';

const EditUserProfilePage = ({ route }) => {
    const navigation = useNavigation();
    const { dataValue } = route.params;
    const [selectedImage, setSelectedImage] = useState(dataValue.imageUrl || null);
    const [editedValue, setEditedValue] = useState({
        id: dataValue.userId,
        email: dataValue.email,
        username: dataValue.username,
        role: dataValue.role,
        nip: dataValue.nip, // Menambahkan nip
    });
    const [isLoading, setIsLoading] = useState(false);

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
            setSelectedImage(imageUri);
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
            setIsLoading(true);

            await dispatch(EditProfile(editedValue, selectedImage, dataValue.imageUrl));

            setIsLoading(false);

            Alert.alert(
                'Sukses',
                'Data berhasil diperbarui!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack(),
                    },
                ],
                { cancelable: false }
            );

        } catch (error) {
            setIsLoading(false);
            console.error(error);
            Alert.alert('Gagal memperbarui data');
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity onPress={openCameraPicker}>
                    <View style={styles.imageContainer}>
                        {selectedImage ? (
                            <Image source={{ uri: selectedImage }} style={styles.image} />
                        ) : (
                            <View style={styles.imageIcon}>
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
                    <Text style={styles.textTitle}>NIP</Text>
                    <TextInput
                        style={styles.text}
                        value={editedValue.nip}
                        onChangeText={nip => handleInputChange('nip', nip)}
                        placeholder='NIP'
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

export default EditUserProfilePage;

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
