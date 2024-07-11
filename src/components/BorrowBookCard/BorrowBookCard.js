import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import ModalComponent from '../Modal/ModalComponent';
import { useNavigation } from '@react-navigation/native';


const BorrowBookCard = (props) => {
    const navigation = useNavigation()
    const borrowedBooks = useSelector(state => state.borrowBook.allBorrowedBook);
    console.log('====================================');
    console.log(borrowedBooks);
    console.log('====================================');
    const handleGotoDetail = (item) => {
        navigation.navigate('DetailBorrowBookPage', { selectedItem: item });
    };


    return (
        <View>
            {props.refreshing ? (
                Array.from(Array(users && users.length > 0 ? users.length : 5).keys()).map((_, index) => (
                    <View key={index} style={styles.container}>
                        <ShimmerPlaceholder
                            key={index}
                            style={[styles.shimmer]}
                            duration={1000}
                            shimmerColors={['#EDEDED', '#D9D9D9', '#EDEDED']}
                            shimmerStyle={{ borderRadius: 10 }}
                        />
                    </View>
                ))
            ) : (
                borrowedBooks.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => handleGotoDetail(item)}>
                        <View style={styles.container}>
                            <View style={styles.cardContainer}>
                                {item.book.imageUrl ? (
                                    <View style={styles.image}>
                                        <Image source={{ uri: item.book.imageUrl }} style={styles.imageStyle} />
                                    </View>
                                ) : (
                                    <View style={styles.image}>
                                        <Icon name='image' size={34} />
                                    </View>
                                )}
                                <View style={styles.detailContainer}>
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.title}>Peminjam : {item.user.username}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.qtyText1}>Buku : {item.book.title}</Text>
                                        <Text style={styles.qtyText1}>
                                            Status : {''}
                                            <Text style={{ color: item.request.approved ? 'green' : 'red' }}>
                                                {item.request.approved ? 'Disetujui' : 'Belum disetujui'}
                                            </Text>
                                        </Text>
                                        <Text style={styles.qtyText1}>Durasi Pinjam : {item.request.borrowDuration} Hari</Text>
                                        {item.request.aproved === true && (
                                            <Text style={styles.qtyText1}>Tanggal Pengembalian : {item.request.returnDate}</Text>
                                        )}
                                    </View>
                                    <View style={styles.qty}>
                                        <Text style={styles.qtyText1}></Text>
                                        <Text style={styles.qtyText2}>Tap to see details</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            )}
        </View>
    )
}

export default BorrowBookCard

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 40,
        marginVertical: 8
    },
    cardContainer: {
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#D9D9D9',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 92,
        height: 100,
        borderRadius: 10,
        backgroundColor: '#747474',
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'cover'
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    detailContainer: {
        flex: 1,
        marginLeft: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: '600',
        fontSize: 20,
        color: 'black',
        marginBottom: 8
    },
    qty: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 12,
    },
    qtyText1: {
        fontSize: 16,
        color: '#747474'
    },
    qtyText2: {
        fontSize: 12,
        top: 8,
        color: 'tomato'
    },
    shimmer: {
        marginVertical: 8,
        width: '100%',
        height: 80
    }
})