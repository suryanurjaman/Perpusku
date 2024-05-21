import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const LogoComponent = () => {

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Perpusku.</Text>
        </View>
    )
}

export default LogoComponent

const styles = StyleSheet.create({
    logo: {
        fontWeight: 'bold',
        fontSize: 40,
        color: '#141218'
    }
})