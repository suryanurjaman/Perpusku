import { StyleSheet, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'

const AdminAddUserIcon = ({ focused }) => {
    const iconColor = focused ? '#fff' : '#D3D3D3';
    return (
        <View style={styles.container}>
            <Icon name='adduser' size={24} color={iconColor} />
        </View>
    )
}

export default AdminAddUserIcon

const styles = StyleSheet.create({})