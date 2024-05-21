import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import LogoComponent from '../../components/Logo/LogoComponent'

const SplashScreen = ({ navigation }) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.replace('SignIn')
        }, 1000);
    })
    return (
        <View style={styles.container}>
            <LogoComponent />
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
})