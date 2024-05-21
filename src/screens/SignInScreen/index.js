import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import PasswordField from '../../components/TextInput/PasswordInputComponent'
import EmailField from '../../components/TextInput/TextInputComponent'
import LogoComponent from '../../components/Logo/LogoComponent'
import SignUpBtn from '../../components/Button/SignUpBtnComponent'
import { handleGoTo } from '../../utils'
import TextInputComponent from '../../components/TextInput/TextInputComponent'
import { Login } from '../../redux/actions/AuthAction'
import { useDispatch } from 'react-redux'

const SignIn = ({ navigation }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const dispatch = useDispatch()
    const submit = () => {
        if (email.trim() === '' || password.trim() === '') {
            // Menampilkan pesan kesalahan jika email atau password kosong
            Alert.alert('Error', 'Please fill in both email and password.');
        } else {
            dispatch(Login(email, password));
        }
    }
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <LogoComponent />
                <Text>Welcome</Text>
            </View>
            <View style={styles.input} >
                <TextInputComponent
                    placeholder='Enter email'
                    value={email}
                    onChangeText={value => setEmail(value)}
                />
                <PasswordField
                    value={password}
                    onChangeText={value => setPassword(value)}
                />
                <Text style={styles.textForgotPwd}>
                    Forgot Password
                </Text>
            </View>
            <View>
                <SignUpBtn onPress={submit} title='Sign In' style={styles.button} styleText={styles.textButton} />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.text1}>
                    Not a member?
                </Text>
                <TouchableOpacity onPress={() => handleGoTo(navigation, 'SignUp')}>
                    <Text style={styles.text2}>
                        Register now
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignIn

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

    },
    textForgotPwd: {
        paddingRight: 4,
        fontSize: 14,
        color: 'black',
        textAlign: 'right',
        marginBottom: 200
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