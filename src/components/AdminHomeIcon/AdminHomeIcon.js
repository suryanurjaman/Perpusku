import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Octicons'

const AdminHomeIcon = ({ focused }) => {
    const iconColor = focused ? '#fff' : '#D3D3D3';
    return (
        <View style={styles.container}>
            <Icon name='home' size={24} color={iconColor} />
        </View>
    )
}

export default AdminHomeIcon

const styles = StyleSheet.create({})