import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ButtonComponent from '../../../components/Button/ButtonComponent';
import { useDispatch } from 'react-redux';
import { approveBorrowRequest, requestReturnBook } from '../../../redux/actions/BorrowBookAction';

const DetailBorrowBookPageUser = ({ route, navigation }) => {
    const { selectedItem } = route.params;
    const dispatch = useDispatch()
    console.log('====================================');
    console.log('datatatatat :', selectedItem);
    console.log('====================================');

    const handleApproveReturn = async () => {
        try {
            await dispatch(requestReturnBook(selectedItem.id))
            Alert.alert(
                'Persetujuan Peminjaman',
                'Peminjaman Berhasil Diajukan',
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
            Alert.alert('Terjadi kesalahan', 'Tidak dapat mengajukan pengembalian saat ini');
        }
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.imageContainer}>
                    {selectedItem.imageUrl && (
                        <Image
                            source={{ uri: selectedItem.imageUrl }}
                            style={styles.image}
                            resizeMode='cover'
                        />
                    )
                    }
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.textTitle}>Peminjam</Text>
                <View>
                    <Text style={styles.text}>{selectedItem.username}</Text>
                </View>
                <Text style={styles.textTitle}>Buku</Text>
                <View>
                    <Text style={styles.text}>{selectedItem.title}</Text>
                </View>
                <Text style={styles.textTitle}>Status Peminjaman</Text>
                <View>
                    <Text style={[styles.text, { color: selectedItem.status ? 'green' : 'red' }]}>
                        {selectedItem.status ? 'Disetujui' : 'Belum Disetujui'}
                    </Text>
                </View>
                <Text style={[styles.textTitle]}>Lama Pinjam</Text>
                <View>
                    <Text style={styles.text}>{selectedItem.borrowDuration} Hari</Text>
                </View>
                <Text style={styles.textTitle}>Tanggal Pengembalian</Text>
                <View>
                    <Text style={styles.text}>{selectedItem.returnDate}</Text>
                </View>
                {selectedItem.status && (
                    <View style={styles.buttonContainer}>
                        <ButtonComponent onPress={handleApproveReturn} styleText={styles.buttonText} title='Ajukan Pengembalian' />
                    </View>
                )}
            </View>
        </ScrollView>
    )
}

export default DetailBorrowBookPageUser

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
})