import React, { useEffect, useState } from 'react';
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import ButtonComponent from '../Button/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { Logout, } from '../../redux/actions/AuthAction'; // Sesuaikan path dengan struktur proyek Anda
import ThreeDotComponentUser from '../ThreeDot/ThreeDotComponentUser';
import DateTimePicker from '@react-native-community/datetimepicker';
import { requestBorrowBook } from '../../redux/actions/BorrowBookAction';

const ModalComponentUser = ({ dataValue, modalVisible, hideModal, title, isProfile, isBook }) => {
    const dispatch = useDispatch();
    const isUser = useSelector(state => state.auth.userData.role);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [maxDate, setMaxDate] = useState(new Date().setDate(new Date().getDate() + 7)); // 7 days from today
    const [borrowDuration, setBorrowDuration] = useState(0); // Durasi default
    const [dateSelected, setDateSelected] = useState(false);

    console.log('====================================');
    console.log(borrowDuration);
    console.log('====================================');

    const setLogout = () => {
        dispatch(Logout());
    };

    const setBorrowBook = () => {
        // Validasi apakah tanggal sudah dipilih
        if (!dateSelected) {
            Alert.alert('Pilih Tanggal', 'Harap pilih tanggal sebelum meminjam buku. Klik tombol di sebelah kanan bawah untuk memilih tanggal');
            return;
        }

        // Validasi apakah durasi peminjaman minimal 1 hari
        if (borrowDuration <= 0) {
            Alert.alert('Durasi Peminjaman Tidak Valid', 'Peminjaman harus dilakukan setidaknya selama satu hari.');
            return;
        }

        // Validasi apakah hari ini adalah Sabtu atau Minggu
        const today = new Date();
        const day = today.getDay();
        if (day === 0 || day === 6) { // 0 adalah Minggu dan 6 adalah Sabtu
            Alert.alert("Hari Libur", "Anda tidak dapat mengajukan pinjaman buku pada hari Sabtu atau Minggu.");
            return;
        }

        dispatch(requestBorrowBook(dataValue.id, borrowDuration));
    };

    const handleDateConfirm = (event, date) => {
        setShowDatePicker(false);
        if (date) {
            const day = date.getDay();
            if (day === 0 || day === 6) { // 0 adalah Minggu dan 6 adalah Sabtu
                Alert.alert("Tanggal tidak valid", "Pengembalian tidak bisa dilakukan pada hari Sabtu atau Minggu. Silakan pilih tanggal lain.");
                return;
            }

            setSelectedDate(date);
            setDateSelected(true);


            // Hitung durasi peminjaman dalam hari
            const today = new Date();
            const diffTime = Math.abs(date - today);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setBorrowDuration(diffDays);
        }
    };

    const openDatePicker = () => {
        setShowDatePicker(true);
    };

    useEffect(() => {
        // Set nilai default untuk borrowDuration ketika modal ditampilkan kembali
        setBorrowDuration(0);
        setDateSelected(false); // Atau nilai default yang sesuai dengan logika aplikasi Anda
    }, [modalVisible]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={hideModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.headContainer}>
                        <TouchableOpacity onPress={hideModal}>
                            <Icon
                                style={styles.closeButton}
                                name='close'
                                size={24}
                            />
                        </TouchableOpacity>
                        <Text style={styles.detail}>
                            {title}
                        </Text>
                        {isBook ? (
                            <Icon2
                                style={styles.closeButton}
                                name='bookmark'
                                size={24}
                            />
                        ) : (
                            <ThreeDotComponentUser
                                dataValue={dataValue}
                                dataType={isProfile ? 'profile' : 'user'}
                                hideModal={hideModal}
                            />
                        )}
                    </View>
                    <View style={styles.imageContainer}>
                        {isBook ? (
                            dataValue.imageUrl ? (
                                <Image style={styles.imageBook} source={{ uri: dataValue.imageUrl }} />
                            ) : (
                                <Icon name="user" style={styles.imageIcon} />
                            )
                        ) : (
                            dataValue.imageUrl ? (
                                <Image style={styles.image} source={{ uri: dataValue.imageUrl }} />
                            ) : (
                                <View style={styles.imageIcon}>
                                    <Icon2 size={40} name="image" />
                                </View>
                            )
                        )}
                        <Text style={styles.modalTitle}>{dataValue.title || dataValue.username || dataValue.name}</Text>
                        <Text style={styles.author}>{isBook ? `Penulis: ${dataValue.author}` : dataValue.role}</Text>
                        {isBook && <Text style={styles.stock}>{`Stock: ${dataValue.stock}`}</Text>}
                    </View>
                    <View style={styles.HeadContent}>
                        <Text style={styles.about}>{isBook ? 'About the Book' : 'Email'}</Text>
                        {isBook ? (
                            <View style={{ maxHeight: 100 }}>
                                <ScrollView>
                                    <Text style={styles.description}>{dataValue.description}</Text>
                                    <Text style={styles.description}>{dataValue.dateAdded}</Text>
                                </ScrollView>
                            </View>
                        ) : (
                            <Text style={styles.description}>{dataValue.email}</Text>
                        )}
                        {isBook && (
                            <View>
                                <Text style={styles.about}>Penerbit</Text>
                                <View style={{ maxHeight: 100 }}>
                                    <ScrollView>
                                        <Text style={styles.description}>{dataValue.publisher}</Text>
                                    </ScrollView>
                                </View>
                            </View>
                        )}
                    </View>

                    {isProfile && dataValue.nip && (
                        <>
                            <Text style={styles.about}>NIS</Text>
                            <Text style={styles.nip}>{`${dataValue.nip}`}</Text>
                        </>
                    )}

                    {isProfile && (
                        <View style={styles.footContainer}>
                            <ButtonComponent onPress={setLogout} styleText={styles.buttonText} style={styles.button} title='Log out' />
                        </View>
                    )}

                    {isUser === 'User' && !isProfile && (
                        <View style={styles.footContainerBorrow}>
                            <View style={styles.buttonWrapper}>
                                {borrowDuration > 0 ? (
                                    <TouchableOpacity onPress={setBorrowBook} style={styles.btnContaniner}>
                                        <Text style={styles.btnText}>{`Pinjam untuk ${borrowDuration} hari`}</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <ButtonComponent onPress={setBorrowBook} styleText={styles.buttonText} style={styles.buttonBorrow} title='Pinjam Buku' />
                                )}
                                <TouchableOpacity onPress={openDatePicker} style={styles.datePickerButton}>
                                    <Icon name="calendar" style={styles.datePickerIcon} />
                                </TouchableOpacity>
                            </View>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="default"
                                    onChange={handleDateConfirm}
                                    minimumDate={new Date().setDate(new Date().getDate() + 1)} // Tanggal besok
                                    maximumDate={maxDate}
                                />
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default ModalComponentUser;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 328,
        backgroundColor: 'white',
        padding: 30,
        margin: 20,
        borderRadius: 10,
    },
    headContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginBottom: 16,
        backgroundColor: 'tomato'
    },
    imageIcon: {
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#9D9D9D'
    },
    imageBook: {
        width: 160,
        height: 220,
        borderRadius: 10,
        marginBottom: 16,
        backgroundColor: 'tomato'
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4
    },
    author: {
        fontSize: 16,
        color: '#9D9D9D',
        marginBottom: 8
    },
    stock: {
        color: '#9D9D9D',
    },
    detail: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center'
    },
    about: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4
    },
    description: {
        fontSize: 16,
        color: '#9D9D9D',
        textAlign: 'justify',
        marginBottom: 20
    },
    footContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20
    },
    footContainerBorrow: {
        marginTop: 20,
    },
    buttonWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    buttonText: {
        paddingVertical: 16,
    },
    buttonBorrow: {
        flex: 1, // Membuat tombol Pinjam Buku fleksibel
    },
    datePickerButton: {
        marginLeft: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 5,
        backgroundColor: '#ddd',
    },
    datePickerIcon: {
        fontSize: 24,
        color: 'black',
    },
    btnContaniner: {
        flex: 1,
        borderRadius: 10,
        backgroundColor: '#747474',
        width: '100%'
    },
    btnText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
        paddingVertical: 16,
    },
});
