import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const ButtonComponent = ({ title, style, styleText, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.btnContaniner, style]}>
            <Text style={[styles.btnText, styleText]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default ButtonComponent

const styles = StyleSheet.create({
    btnContaniner: {
        borderRadius: 10,
        backgroundColor: '#747474',
        width: '100%'
    },
    btnText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    },
})