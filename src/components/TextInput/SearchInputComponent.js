import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';

const SearchInputComponent = ({ value, onChangeText }) => {

    return (
        <View style={styles.container}>
            <View style={[styles.inputContainer]}>
                <TextInput
                    style={[styles.input]}
                    placeholder='search...'
                    value={value}
                    onChangeText={onChangeText}
                    placeholderTextColor="#747474"
                />
                <Icon
                    style={styles.icon}
                    name="search1"
                    size={24}
                    color="#747474"
                />
            </View>
        </View>
    )
}

export default SearchInputComponent

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: '#D9D9D9',
        paddingVertical: 4,
        paddingHorizontal: 12,
        width: 328,
    },
    input: {
        fontSize: 16,
        flex: 1,
        paddingLeft: 44,
    },
    icon: {
        position: 'absolute',
        top: 16,
        left: 16,
    },
})