import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'
import TextInputComponent from '../../../components/TextInput/TextInputComponent'
import TextFieldComponent from '../../../components/TextField/TextFieldComponent'
import ButtonComponent from '../../../components/Button/ButtonComponent'
import DropdownComponent from '../../../components/DropdownComponent/DropdownComponent'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { addBook } from '../../../redux/actions/BookAction'
import { useDispatch } from 'react-redux'
import storage from '@react-native-firebase/storage'
import Icon from 'react-native-vector-icons/AntDesign'
import DateTimePicker from '@react-native-community/datetimepicker';

const AddBookData = () => {
    const dispatch = useDispatch();
    const [selectedImage, setSelectedImage] = useState(null);
    const [open, setOpen] = useState(false);
    const [category, setCategory] = useState(null);
    const [addCategory, setAddCategory] = useState('');
    const [items, setItems] = useState([
        { label: 'Fiksi', value: 'Fiksi' },
        { label: 'Non-Fiksi', value: 'Non-fiksi' },
        { label: 'Novel', value: 'Novel' },
        { label: 'Biografi', value: 'Biografi' },
        { label: 'Tambahkan', value: 'Tambahkan' },
    ]);
    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        publisher: '',
        description: '',
        stock: '',
        publishYear: new Date(),
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

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
    };

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

    const handleInputChange = (key, value) => {
        setBookData({ ...bookData, [key]: value });
    };

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || bookData.publishYear;
        setShowDatePicker(false);
        handleInputChange('publishYear', currentDate);
    };

    // Format publishYear untuk tampilan


    const handleAddBook = async () => {
        try {
            // Format publishYear sebagai string YYYY-MM-DD
            const formattedPublishYear = bookData.publishYear
                ? `${bookData.publishYear.getFullYear()}-${('0' + (bookData.publishYear.getMonth() + 1)).slice(-2)}-${('0' + bookData.publishYear.getDate()).slice(-2)}`
                : '';

            const validations = {
                'Judul': bookData.title,
                'Penulis': bookData.author,
                'Penerbit': bookData.publisher,
                'Deskripsi': bookData.description,
                'Stok': bookData.stock,
                'Kategori': category,
                'Image': selectedImage,
                'Tahun Terbit': formattedPublishYear // Gunakan formattedPublishYear
            };

            for (const key in validations) {
                if (!validations[key]) {
                    Alert.alert('Pesan Kesalahan', `${key} belum diisi`);
                    return;
                }
            }

            if (category === 'Tambahkan') {
                Alert.alert('Pesan Kesalahan', 'Kategori belum dipilih');
                return;
            }

            // Validasi stok adalah bilangan bulat positif
            const stockNumber = parseInt(bookData.stock);
            if (isNaN(stockNumber) || stockNumber <= 0) {
                Alert.alert('Pesan Kesalahan', 'Stok harus berupa bilangan bulat positif');
                return;
            }

            const currentDate = new Date();
            const timestamp = currentDate.getTime();
            const fileName = `${bookData.title.replace(/\s/g, '')}_${timestamp}`;
            const reference = storage().ref(`bookImages/${fileName}`);
            await reference.putFile(selectedImage);
            const imageUrl = await reference.getDownloadURL();
            const bookWithImage = {
                ...bookData,
                imageUrl,
                category: category,
                dateAdded: currentDate,
                publishYear: formattedPublishYear // Simpan sebagai string YYYY-MM-DD
            };

            await dispatch(addBook(bookWithImage));
            console.log('Upload data berhasil');

            setBookData({
                title: '',
                author: '',
                publisher: '',
                description: '',
                stock: '',
                publishYear: new Date(), // Reset ke Date object
            });
            setSelectedImage(null);
            setCategory(null);

            // Menampilkan alert ketika upload berhasil
            Alert.alert('Sukses', 'Data berhasil diunggah');

        } catch (error) {
            console.error(error);
            // Menampilkan alert jika terjadi kesalahan
            Alert.alert('Error', 'Terjadi kesalahan saat mengunggah data. Silakan coba lagi.');
        }
    };


    const openImagePicker = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        launchImageLibrary(options, handleResponse);
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

    return (
        <ScrollView>
            <View style={styles.container}>
                <TouchableOpacity onPress={openCameraPicker}>
                    <View style={styles.imageContainer}>
                        {selectedImage && (
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.image}
                                resizeMode='cover'
                            />
                        )}
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
                        />
                    </View>
                    {category === 'Tambahkan' && renderAddCategoryField()}
                    <Text style={styles.textTitle}>Nama Buku</Text>
                    <TextInputComponent
                        value={bookData.title}
                        onChangeText={(value) => handleInputChange('title', value)}
                        placeholder='Nama buku'
                    />
                    <Text style={styles.textTitle}>Penulis</Text>
                    <TextInputComponent
                        placeholder='Penulis'
                        value={bookData.author}
                        onChangeText={(value) => handleInputChange('author', value)}
                    />
                    <Text style={styles.textTitle}>Penerbit</Text>
                    <TextInputComponent
                        placeholder='Penerbit'
                        value={bookData.publisher}
                        onChangeText={(value) => handleInputChange('publisher', value)}
                    />
                    <Text style={styles.textTitle}>Deskripsi</Text>
                    <TextFieldComponent
                        style={{ paddingVertical: 24 }}
                        placeholder={'Deskripsi'}
                        value={bookData.description}
                        onChangeText={(value) => handleInputChange('description', value)}
                    />
                    <Text style={styles.textTitle}>Stok</Text>
                    <TextInputComponent
                        keyboardType='numeric'
                        placeholder='Stok'
                        value={bookData.stock}
                        onChangeText={(value) => handleInputChange('stock', value)}
                    />
                    <Text style={styles.textTitle}>Tahun Terbit</Text>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                        <TextInputComponent
                            value={bookData.publishYear ? `${bookData.publishYear.getFullYear()}-${('0' + (bookData.publishYear.getMonth() + 1)).slice(-2)}-${('0' + bookData.publishYear.getDate()).slice(-2)}` : 'Pilih tanggal'}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            mode='date'
                            value={bookData.publishYear}
                            onChange={handleDateChange}
                            maximumDate={new Date()}
                        />
                    )}
                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={handleAddBook} styleText={styles.buttonText} title='Input data' />
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default AddBookData

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
        marginTop: 20,
    },
    imageContainer: {
        backgroundColor: 'tomato',
        width: 160,
        height: 220,
        borderRadius: 10,
    },
    image: {
        width: 160,
        height: 220,
        borderRadius: 10,
    },
    inputContainer: {
        marginVertical: 24,
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
})
