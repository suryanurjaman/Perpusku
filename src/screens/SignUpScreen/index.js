import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import LogoComponent from '../../components/Logo/LogoComponent'
import PasswordField from '../../components/TextInput/PasswordInputComponent'
import SignUpBtn from '../../components/Button/SignUpBtnComponent'
import TextInputComponent from '../../components/TextInput/TextInputComponent'
import { handleGoTo } from '../../utils'
import { useDispatch } from 'react-redux'
import { SignUp } from '../../redux/actions/AuthAction'

const SignUpScreen = ({ navigation }) => {
    const dispatch = useDispatch()
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('Admin')

    const handleSignUp = async () => {
        try {
            if (username && email && password) {
                await dispatch(SignUp(username, email, password, role));
                navigation.navigate('SignIn');
                console.log('user berhasil dibuat')
            } else {
                Alert.alert('Username, email, and password are required.');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.status === 409) {
                Alert.alert('Email already exists. Please use a different email.');
            } else {
                Alert.alert('Error creating user:', error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <LogoComponent />
                <Text>Welcome</Text>
            </View>
            <View style={styles.input} >
                <TextInputComponent
                    placeholder='Enter username'
                    value={username}
                    onChangeText={value => setUsername(value)}
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
    )
}

export default SignUpScreen

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
    input: {
        marginBottom: 200
    },
    textForgotPwd: {
        paddingRight: 4,
        fontSize: 14,
        color: 'black',
        textAlign: 'right',

    },

    button: {
        backgroundColor: '#747474',
        marginBottom: 20,
        width: 328,
    },
    textButton: {
        color: 'white',
        textAlign: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    text1: {
        marginRight: 4
    },
    text2: {
        color: 'black',
    }
})