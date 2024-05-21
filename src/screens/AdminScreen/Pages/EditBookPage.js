import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import TextInputComponent from '../../../components/TextInput/TextInputComponent';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import TextFieldComponent from '../../../components/TextField/TextFieldComponent';
import DropdownComponent from '../../../components/DropdownComponent/DropdownComponent';
import Icon from 'react-native-vector-icons/AntDesign'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useDispatch } from 'react-redux';
import { updateBook } from '../../../redux/actions/BookAction';

const EditBookPage = ({ route }) => {
    const { dataValue } = route.params;
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(dataValue.imageUrl);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(dataValue.category);
    const [addCategory, setAddCategory] = useState('')
    const [items, setItems] = useState([
        { label: 'Sejarah', value: 'Sejarah' },
        { label: 'Horor', value: 'Horor' },
        { label: 'Fiksi', value: 'Fiksi' },
        { label: 'Non-Fiksi', value: 'Non-fiksi' },
        { label: 'Novel', value: 'Novel' },
        { label: 'Biografi', value: 'Biografi' },
        { label: 'Tambahkan', value: 'Tambahkan' }
    ]);

    const [editedDataValue, setEditedDataValue] = useState({
        title: dataValue.title,
        author: dataValue.author,
        publisher: dataValue.publisher,
        description: dataValue.description,
        stock: dataValue.stock
    });

    const handleInputChange = (key, value) => {
        setEditedDataValue(prevState => ({
            ...prevState,
            [key]: value
        }));
    };

    const handleAddCategory = () => {
        if (addCategory.trim() !== '') {
            const capitalizedCategory = addCategory
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(" ");
            const newCategory = { label: capitalizedCategory, value: capitalizedCategory }
            setItems([...items.slice(0, items.length - 1), newCategory, items[items.length - 1]]);
            setCategory(capitalizedCategory);
            setOpen(false);
            setAddCategory('');
        }
    }

    const renderAddCategoryField = () => {
        return (
            <View style={styles.addNewCategoryContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Masukkan kategori baru"
                    value={addCategory}
                    onChangeText={(text) => setAddCategory(text)}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
                    <Icon name='plus' size={20} />
                </TouchableOpacity>
            </View>
        );
    };

    const openCameraPicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchCamera(options, handleResponse);
    };

    const handleResponse = (response) => {
        if (response.didCancel) {
            console.log('User cancelled image picker');
        } else if (response.error) {
            console.log('Image picker error: ', response.error);
        } else {
            let imageUri = response.uri || response.assets?.[0]?.uri;
            setSelectedImage(imageUri);
        }
    };

    const handleSaveChanges = async () => {
        try {

            // Lakukan validasi terlebih dahulu
            const validations = {
                'Judul': editedDataValue.title,
                'Penulis': editedDataValue.author,
                'Penerbit': editedDataValue.publisher,
                'Deskripsi': editedDataValue.description,
                'Stok': editedDataValue.stock,
                'Kategori': category
            };

            for (const key in validations) {
                if (!validations[key]) {
                    Alert.alert('Pesan Kesalahan', `${key} belum diisi`);
                    return;
                }
            }

            if (category === 'Tambahkan') {
                console.log('Kategori belum dipilih');
                return;
            }

            const stockNumber = parseInt(editedDataValue.stock);
            if (isNaN(stockNumber) || stockNumber <= 0) {
                Alert.alert('Stok harus berupa bilangan bulat positif');
                return;
            }

            const updatedData = {
                id: dataValue.id,
                title: editedDataValue.title,
                author: editedDataValue.author,
                publisher: editedDataValue.publisher,
                description: editedDataValue.description,
                stock: editedDataValue.stock,
                category: category,
            };

            await dispatch(updateBook(updatedData, selectedImage, dataValue.imageUrl));

            console.log('Data berhasil diperbarui');

        } catch (error) {
            console.error(error);
            console.log('Gagal memperbarui data');
        }
    };


    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity onPress={openCameraPicker}>
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: selectedImage }} style={styles.image} />
                    </View>
                </TouchableOpacity>
                <View style={styles.inputContainer}>
                    <Text style={styles.textTitle}>Kategori</Text>
                    <View>
                        <DropdownComponent
                            open={open}
                            value={category}
                            items={items}
                            setOpen={setOpen}
                            setValue={setCategory}
                            setItems={setItems}
                            initialValue={dataValue.category}
                            onChangeValue={(selectedValue) => handleInputChange('category', selectedValue)}
                        />
                        {category === 'Tambahkan' && renderAddCategoryField()}
                    </View>
                    <Text style={styles.textTitle}>Nama Buku</Text>
                    <TextInputComponent
                        value={editedDataValue.title}
                        onChangeText={(text) => handleInputChange('title', text)}
                        placeholder='Nama buku'
                    />
                    <Text style={styles.textTitle}>Penulis</Text>
                    <TextInputComponent
                        value={editedDataValue.author}
                        onChangeText={(text) => handleInputChange('author', text)}
                        placeholder='Penulis'
                    />
                    <Text style={styles.textTitle}>Penerbit</Text>
                    <TextInputComponent
                        value={editedDataValue.publisher}
                        onChangeText={(text) => handleInputChange('publisher', text)}
                        placeholder='Penerbit'
                    />
                    <Text style={styles.textTitle}>Deskripsi</Text>
                    <TextFieldComponent
                        value={editedDataValue.description}
                        onChangeText={(text) => handleInputChange('description', text)}
                        style={{ paddingVertical: 24 }}
                        placeholder={'Deskripsi'}
                    />
                    <Text style={styles.textTitle}>Stok</Text>
                    <TextInputComponent
                        value={editedDataValue.stock.toString()}
                        onChangeText={(text) => handleInputChange('stock', text)}
                        keyboardType='numeric'
                        placeholder='Stok'
                    />
                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={handleSaveChanges} styleText={styles.buttonText} title='Edit data' />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default EditBookPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginTop: 20
    },
    imageContainer: {
        backgroundColor: 'tomato',
        width: 160,
        height: 220,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    inputContainer: {
        marginVertical: 24
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 12,
        marginLeft: 8
    },
    buttonContainer: {
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        paddingVertical: 20
    },
    addNewCategoryContainer: {
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
    image: {
        width: 160,
        height: 220,
        borderRadius: 10,
    },
})
