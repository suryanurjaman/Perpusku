import { StyleSheet, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign'
import IconHome from 'react-native-vector-icons/Octicons'

const AdminIcon = ({ focused, isBook, isUser, isHome, isReport }) => {
    const iconColor = focused ? '#fff' : '#D3D3D3';
    return (
        <View style={styles.container}>
            {isBook && (
                <Icon name='book' size={24} color={iconColor} />
            )}
            {isUser && (
                <Icon name='adduser' size={24} color={iconColor} />
            )}
            {isHome && (
                <IconHome name='home' size={24} color={iconColor} />
            )}
            {isReport && (
                <Icon name='pdffile1' size={24} color={iconColor} />
            )}
        </View>
    )
}

export default AdminIcon

const styles = StyleSheet.create({})