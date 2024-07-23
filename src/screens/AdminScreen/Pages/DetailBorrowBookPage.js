import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import ButtonComponent from '../../../components/Button/ButtonComponent';
import { useDispatch } from 'react-redux';
import { approveBorrowRequest, approveReturnRequest, extendBorrowDuration } from '../../../redux/actions/BorrowBookAction';

import ExtendReturnModal from '../../../components/Modal/ExtendReturnModal';
import ReturnConfirmationModal from '../../../components/Modal/ReturnConfirmationModal ';


const DetailBorrowBookPage = ({ route, navigation }) => {
    const { selectedItem } = route.params;
    const dispatch = useDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [extendModalVisible, setExtendModalVisible] = useState(false);

    const handleApproveBorrow = async () => {
        try {
            await dispatch(approveBorrowRequest(selectedItem.id, selectedItem.request.borrowDuration));
            Alert.alert(
                'Persetujuan Peminjaman',
                'Peminjaman berhasil disetujui',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.log(error);
        }
    };

    const handleApproveReturn = (damageInfo, lossInfo) => {
        dispatch(approveReturnRequest(selectedItem.id, damageInfo, lossInfo))
            .then(() => {
                Alert.alert(
                    'Persetujuan Pengembalian',
                    'Pengembalian berhasil disetujui',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack()
                        }
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleExtendReturnPeriod = (numberOfDays) => {
        dispatch(extendBorrowDuration(selectedItem.id, numberOfDays))
            .then(() => {
                Alert.alert(
                    'Perpanjangan Pengembalian',
                    'Perpanjangan berhasil dilakukan',
                    [
                        {
                            text: 'OK',
                            onPress: () => setExtendModalVisible(false)
                        }
                    ],
                    { cancelable: false }
                );
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const getStatusText = () => {
        if (!selectedItem.request.approved) {
            return 'Belum disetujui';
        } else if (selectedItem.request.ongoing === true) {
            return 'Sedang dipinjam';
        } else {
            return 'Peminjaman telah selesai';
        }
    };

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    {selectedItem.book.imageUrl && (
                        <Image
                            source={{ uri: selectedItem.book.imageUrl }}
                            style={styles.image}
                            resizeMode='cover'
                        />
                    )}
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.textTitle}>Status</Text>
                <View>
                    <Text style={styles.text}>{getStatusText()}</Text>
                </View>
                <Text style={styles.textTitle}>Peminjam</Text>
                <View>
                    <Text style={styles.text}>{selectedItem.user.username}</Text>
                </View>
                <Text style={styles.textTitle}>Buku</Text>
                <View>
                    <Text style={styles.text}>{selectedItem.book.title}</Text>
                </View>
                <Text style={styles.textTitle}>Lama Pinjam</Text>
                <View>
                    <Text style={styles.text}>{selectedItem.request.borrowDuration} Hari</Text>
                </View>
                <Text style={styles.textTitle}>Stok Buku</Text>
                <View>
                    <Text style={styles.text}>{selectedItem.book.stock}</Text>
                </View>
                {!selectedItem.request.approved && (
                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={handleApproveBorrow} styleText={styles.buttonText} title='Setujui Peminjaman' />
                    </View>
                )}
                {selectedItem.request.returned === false && (
                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={() => setModalVisible(true)} styleText={styles.buttonText} title='Setujui Pengembalian' />
                        <ButtonComponent onPress={() => setExtendModalVisible(true)} styleText={styles.buttonText} title='Perpanjang Pengembalian' />
                    </View>
                )}
            </View>
            <ReturnConfirmationModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onConfirm={handleApproveReturn}
            />
            <ExtendReturnModal
                visible={extendModalVisible}
                onClose={() => setExtendModalVisible(false)}
                onExtend={handleExtendReturnPeriod}
            />
        </ScrollView>
    );
};

export default DetailBorrowBookPage;

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
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        marginVertical: 24,
        marginHorizontal: 50,
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 24,
        marginBottom: 12,
    },
    text: {
        color: '#9D9D9D',
        fontSize: 20,
        marginBottom: 12,
    },
    buttonContainer: {
        marginTop: 16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonText: {
        paddingVertical: 20
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
});
