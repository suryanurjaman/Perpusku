import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const PasswordField = ({ value, onChangeText, stylesTextInput }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.inputContainer, stylesTextInput]}>
            <TextInput
                style={[styles.input]}
                placeholder="Password"
                secureTextEntry={!isPasswordVisible}
                value={value}
                onChangeText={onChangeText}
            />
            <TouchableOpacity style={styles.icon} onPress={togglePasswordVisibility}>
                <Icon name={isPasswordVisible ? 'visibility-off' : 'visibility'} size={24} />
            </TouchableOpacity>
        </View>
    );
};

export default PasswordField;

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
    },
    icon: {
        position: 'absolute',
        right: 12,
    },

});
