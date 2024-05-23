import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextInputComponent from '../../../components/TextInput/TextInputComponent';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import DropdownComponent from '../../../components/DropdownComponent/DropdownComponent';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { launchCamera } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../redux/actions/UserAction';

const EditUserPage = ({ route }) => {
    const dispatch = useDispatch()
    const { dataValue } = route.params;
    const [open, setOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(dataValue.imageUrl);
    const [selectedCategory, setSelectedCategory] = useState(dataValue.role);
    const [dropdownItems, setDropdownItems] = useState([
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
    ]);

    const [editedDataValue, setEditedDataValue] = useState({
        id: dataValue.id,
        username: dataValue.username,
        role: dataValue.role,
    })

    useEffect(() => {
        // Ketika nilai category berubah, update nilai role
        if (selectedCategory !== editedDataValue.role) {
            setEditedDataValue(prevState => ({
                ...prevState,
                role: selectedCategory
            }));
        }
    }, [selectedCategory, editedDataValue.role]);

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

    // Fungsi untuk menangani perubahan pada input
    const handleInputChange = (key, value) => {
        // Menyalin data pengguna yang ada dan mengubah nilai atribut yang sesuai
        setEditedDataValue({
            ...editedDataValue,
            [key]: value,
        });
    };

    // Fungsi untuk menyimpan perubahan
    const handleSaveChanges = async () => {
        try {
            // Lakukan validasi atau manipulasi data jika diperlukan
            console.log(editedDataValue)
            // Panggil fungsi updateUser dengan data yang diperbarui
            await dispatch(updateUser(editedDataValue, selectedImage, dataValue.imageUrl));

            // Tampilkan pesan sukses atau navigasi ke halaman lain jika diperlukan
            console.log('data berhasil di perbaharui')
        } catch (error) {
            console.error('Error while saving changes:', error);
            // Tampilkan pesan kesalahan kepada pengguna jika diperlukan
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
                            <View style={styles.imageIcon} >
                                <Icon2 name="image" size={40} />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <Text style={styles.textTitle}>Username</Text>
                    <TextInputComponent
                        value={editedDataValue.username}
                        onChangeText={text => handleInputChange('username', text)}
                        placeholder='Username'
                    />
                    <Text style={styles.textTitle}>Email</Text>
                    <TextInputComponent
                        value={dataValue.email}
                        placeholder='Email'
                        editable={false}
                    />
                    {dataValue.role === 'User' && (
                        <View>
                            <Text style={styles.textTitle}>Role</Text>
                            <View>
                                <DropdownComponent
                                    open={open}
                                    setOpen={setOpen}
                                    value={selectedCategory}
                                    items={dropdownItems}
                                    setValue={setSelectedCategory}
                                    setItems={setDropdownItems}
                                    initialValue={dataValue.role}
                                />
                            </View>
                        </View>
                    )}
                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={handleSaveChanges} styleText={styles.buttonText} title='Input Data' />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default EditUserPage

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
        marginBottom: 12,
        marginLeft: 8
    },
    buttonContainer: {
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        paddingVertical: 20
    },
    disabledText: {
        color: 'tomato',
        marginLeft: 4,
        top: -8
    }
})