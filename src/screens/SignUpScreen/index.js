import { Alert, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import LogoComponent from '../../components/Logo/LogoComponent';
import PasswordField from '../../components/TextInput/PasswordInputComponent';
import SignUpBtn from '../../components/Button/SignUpBtnComponent';
import TextInputComponent from '../../components/TextInput/TextInputComponent';
import { handleGoTo } from '../../utils';
import { useDispatch } from 'react-redux';
import { SignUp } from '../../redux/actions/AuthAction';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons';

const SignUpScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [nis, setNis] = useState('');
    const [isNisValid, setIsNisValid] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSignUp = async () => {
        try {
            if (username && email && password && nis && isNisValid) {
                if (password.length < 6) {
                    Alert.alert('Error Sign Up', 'Password harus minimal 6 karakter.');
                    return;
                }
                await dispatch(SignUp(username, email, password, role, nis));
                navigation.navigate('SignIn');
                Alert.alert('User berhasil dibuat');
            } else {
                Alert.alert('Error Sign Up', 'Username, email, password, dan NIS tidak boleh kosong');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.status === 409) {
                Alert.alert('Email sudah ada. Tolong gunakan email lain.');
            } else {
                Alert.alert('Error creating user:', error.message);
            }
        }
    };

    const handleNisChange = async (value) => {
        const numericValue = value.replace(/[^0-9]/g, '').slice(0, 8);
        setNis(numericValue);
        setIsNisValid(null); // Reset status NIS validity

        if (numericValue.length === 8) {
            setIsLoading(true);
            try {
                const userDoc = await firestore()
                    .collection('dataSiswa')
                    .where('nis', '==', numericValue)
                    .get();

                if (!userDoc.empty) {
                    const userData = userDoc.docs[0].data();
                    setUsername(userData.username);
                    setIsNisValid(true);
                } else {
                    setUsername('');
                    setIsNisValid(false);
                }
            } catch (error) {
                console.error('Error checking NIS:', error);
                setUsername('');
                setIsNisValid(false);
            } finally {
                setIsLoading(false);
            }
        } else {
            setUsername('');
            setIsNisValid(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <LogoComponent />
                <Text>Welcome</Text>
            </View>
            <View style={styles.inputContainer}>
                <View style={styles.inputWrapper}>
                    <TextInputComponent
                        placeholder='Enter NIS'
                        value={nis}
                        onChangeText={handleNisChange}
                        keyboardType='numeric'
                    />
                    {isLoading ? (
                        <ActivityIndicator style={styles.loadingIndicator} size="small" color="#0000ff" />
                    ) : isNisValid !== null ? (
                        <Icon
                            name={isNisValid ? 'check-circle' : 'cancel'}
                            size={24}
                            color={isNisValid ? 'green' : 'red'}
                            style={styles.statusIcon}
                        />
                    ) : null}
                </View>
                <TextInputComponent
                    placeholder='Enter username'
                    value={username}
                    onChangeText={value => setUsername(value)}
                    editable={false}
                />
                <TextInputComponent
                    placeholder='Enter email'
                    value={email}
                    onChangeText={value => setEmail(value)}
                />
                <PasswordField
                    value={password}
                    onChangeText={value => setPassword(value)}
                />
            </View>
            <View>
                <SignUpBtn
                    onPress={handleSignUp}
                    title='Sign Up'
                    style={styles.button}
                    styleText={styles.textButton}
                />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text1}>
                    Already have an account?
                </Text>
                <TouchableOpacity onPress={() => handleGoTo(navigation, 'SignIn')}>
                    <Text style={styles.text2}>
                        Login
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginBottom: 32
    },
    inputContainer: {
        marginBottom: 200
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative'
    },
    loadingIndicator: {
        position: 'absolute',
        right: 10,
        top: 22
    },
    statusIcon: {
        position: 'absolute',
        right: 10,
        top: 22
    },
    button: {
        backgroundColor: '#747474',
        marginBottom: 20,
        width: 328
    },
    textButton: {
        color: 'white',
        textAlign: 'center'
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text1: {
        marginRight: 4
    },
    text2: {
        color: 'black'
    }
});
