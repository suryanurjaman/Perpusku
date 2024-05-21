// CustomDropdown.js
import React from 'react';
import { StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

const DropdownComponent = ({ open, value, items, setOpen, setValue, setItems, initialValue, onChangeValue }) => {

    return (
        <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            listMode="SCROLLVIEW"
            style={styles.dropdown}
            placeholderStyle={styles.placeholder}
            arrowIconStyle={{ tintColor: 'grey' }}
            dropDownContainerStyle={styles.dropDownContainer}
            labelStyle={styles.label}
            onChangeValue={onChangeValue}
            defaultValue={initialValue}
            placeholder={initialValue ? initialValue : 'Pilih kategori'}
        />
    );
};

export default DropdownComponent;

const styles = StyleSheet.create({
    label: {
        left: -4,
        paddingVertical: 20,
        paddingHorizontal: 12,
    },
    dropdown: {
        borderRadius: 10,
        borderColor: '#D9D9D9',
        backgroundColor: null,
        borderWidth: 1,
        width: 328,
        marginBottom: 16
    },
    dropDownContainer: {
        borderWidth: 0,
    },
    placeholder: {
        paddingVertical: 20,
        paddingHorizontal: 12,
        left: -4,
        color: 'grey'
    },
    inputContainer: {
        flexDirection: 'row',
        marginTop: 8,
        alignItems: 'center',
        marginBottom: 20
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    addButton: {
        color: 'blue',
        textDecorationLine: 'underline',
        position: 'absolute',
        right: 12,
        top: 12
    },
})
