import { Dimensions, StyleSheet, TextInput, View } from 'react-native'
import React from 'react'

const windowWidth = Dimensions.get('window').width;
const TextInputComponent = ({ placeholder, value, onChangeText, style, styleText, keyboardType, editable }) => {

    return (
        <View style={[styles.inputContainer, style]}>
            <TextInput
                editable={editable}
                style={[styles.input, styleText]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor='grey'
                keyboardType={keyboardType}
            />
        </View>
    )
}

export default TextInputComponent

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#D9D9D9',
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
        width: windowWidth * 0.8,
    },
    input: {
        flex: 1,
    },
    icon: {
        position: 'absolute',
        right: 12,
    },
})