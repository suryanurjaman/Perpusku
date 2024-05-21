import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import TextInputComponent from '../../../components/TextInput/TextInputComponent'
import ButtonComponent from '../../../components/Button/ButtonComponent'
import DropdownComponent from '../../../components/DropdownComponent/DropdownComponent'
import { launchCamera } from 'react-native-image-picker'
import Icon2 from 'react-native-vector-icons/FontAwesome';
import { useDispatch } from 'react-redux'
import { addUser } from '../../../redux/actions/UserAction'

const AddNewUser = () => {
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState('');
    const [items, setItems] = useState([
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
    ]);
    console.log(category)
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        role: '',
        imageUrl: null
    })

    useEffect(() => {
        // Ketika nilai category berubah, update nilai role
        setUserData(prevState => ({
            ...prevState,
            role: category
        }));
    }, [category]);

    const handleInputChange = (key, value) => {
        setUserData({ ...userData, [key]: value });
    };

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
            setUserData(prevState => ({
                ...prevState,
                imageUrl: imageUri // Memperbarui imageUrl di state userData
            }));
        }
    };

    const handleAddUser = async () => {
        try {
            await dispatch(addUser(userData));
            console.log('user data berhasil di input :', userData)
        } catch (error) {
            console.error('gagal menginput data :', error)
        }
    };
    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity onPress={openCameraPicker}>
                    <View style={styles.imageContainer}>
                        {userData.imageUrl ? (
                            <Image source={{ uri: userData.imageUrl }} style={styles.image} />
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
                        value={userData.username}
                        onChangeText={(value) => handleInputChange('username', value)}
                        placeholder='Username'
                    />
                    <Text style={styles.textTitle}>Email</Text>
                    <TextInputComponent
                        value={userData.email}
                        onChangeText={(value) => handleInputChange('email', value)}
                        placeholder='Email'
                    />
                    <Text style={styles.textTitle}>Password</Text>
                    <TextInputComponent
                        value={userData.password}
                        onChangeText={(value) => handleInputChange('password', value)}
                        placeholder='Password'
                    />
                    <Text style={styles.textTitle}>Role</Text>
                    <View>
                        <DropdownComponent
                            open={open}
                            value={category}
                            items={items}
                            setOpen={setOpen}
                            setValue={setCategory}
                            setItems={setItems}
                        />
                    </View>
                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={handleAddUser} styleText={styles.buttonText} title='Input Data' />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default AddNewUser

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
    }
})