import { StyleSheet, TextInput, View } from 'react-native';
import React from 'react';

const TextFieldComponent = ({ placeholder, value, onChangeText, style, styleText }) => {
    return (
        <View style={[styles.inputContainer, style]}>
            <TextInput
                style={[styles.input, styleText]}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor='grey'
                multiline={true}
            />
        </View>
    );
};

export default TextFieldComponent;

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
        width: 328,
    },
    input: {
        flex: 1,
        color: 'black'
    },
});
