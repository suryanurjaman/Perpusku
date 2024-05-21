import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/AntDesign'

const CategoryDropdown = ({ value, onChange }) => {
    const [open, setOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(value);
    const [inputCategory, setInputCategory] = useState('');
    const [items, setItems] = useState([
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
    ]);

    // const handleAddCategory = () => {
    //     if (inputCategory.trim() !== '') {
    //         const newCategory = { label: inputCategory, value: inputCategory };
    //         setItems([...items, newCategory]);
    //         setSelectedCategory(inputCategory);
    //         setOpen(false);
    //         onChange('');
    //     }
    // };

    const renderAddCategoryField = () => {
        return (
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Masukkan kategori baru"
                    value={inputCategory}
                    onChangeText={(text) => setInputCategory(text)}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                    <Icon name='plus' size={20} />
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View>
            <DropDownPicker
                open={open}
                value={selectedCategory}
                items={[...items, { label: 'Tambahkan', value: 'tambahkan' }]}
                setOpen={setOpen}
                setValue={(value) => {
                    setSelectedCategory(value);
                    onChange(value)
                }}
                placeholder="Pilih kategori"
                style={styles.dropdown}
                listMode="SCROLLVIEW"
                placeholderStyle={styles.placeholder}
                arrowIconStyle={{ tintColor: 'grey' }}
                dropDownContainerStyle={styles.dropDownContainer}
                labelStyle={styles.label}
            />
            {selectedCategory === 'tambahkan' && renderAddCategoryField()}
        </View>
    );
};

export default CategoryDropdown;

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
});
