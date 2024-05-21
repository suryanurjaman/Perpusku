import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const SignUpBtn = ({ title, style, styleText, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.btnContaniner, style]}>
            <Text style={[styles.btnText, styleText]}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}

export default SignUpBtn

const styles = StyleSheet.create({
    btnContaniner: {
        paddingVertical: 20,
        paddingHorizontal: 108,
        borderRadius: 10,
    },
    btnText: {
        fontSize: 18,
    },
})