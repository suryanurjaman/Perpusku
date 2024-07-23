import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { useNavigation } from '@react-navigation/native';
import { fetchBorrowedBookByUserLogin } from '../../redux/actions/BorrowBookAction';
import auth from '@react-native-firebase/auth';

const BorrowBookByUserCard = ({ selectedCategory, refreshing, searchQuery }) => {
    const dispatch = useDispatch();
    const borrowedBooks = useSelector(state => state.borrowBook.borrowedBook);
    const filteredBooks = selectedCategory === null ? borrowedBooks :
        selectedCategory ? borrowedBooks.filter(book => book.ongoing) :
            borrowedBooks.filter(book => !book.ongoing);

    const searchFilteredBooks = filteredBooks.filter(book => {
        const titleLower = book.title.toLowerCase();
        const queryLower = searchQuery.toLowerCase();
        return titleLower.includes(queryLower);
    });

    const navigation = useNavigation();

    const handleGotoDetail = (item) => {
        navigation.navigate('DetailBorrowBookPageUser', { selectedItem: item });
    };

    React.useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(user => {
            if (user) {
                const userId = user.uid; // Dapatkan userId dari objek user saat dia login
                // Panggil fetchBorrowedBookByUserLogin saat userId tersedia
                dispatch(fetchBorrowedBookByUserLogin(userId));
            }
        });

        return unsubscribe; // Pastikan untuk membatalkan langganan saat komponen unmount
    }, [dispatch]);

    return (
        <View>
            {!borrowedBooks ? (
                Array.from(Array(5).keys()).map((_, index) => (
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
                searchFilteredBooks.map((item) => (
                    <TouchableOpacity key={item.id} onPress={() => handleGotoDetail(item)}>
                        <View style={styles.container}>
                            <View style={styles.cardContainer}>
                                {item.author ? (
                                    <View style={styles.image}>
                                        <Image source={{ uri: item.imageUrl }} style={styles.imageStyle} />
                                    </View>
                                ) : (
                                    <View style={styles.image}>
                                        <Icon name='image' size={34} />
                                    </View>
                                )}
                                <View style={styles.detailContainer}>
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.title}>Peminjam : {item.username}</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.qtyText1}>Buku : {item.title}</Text>
                                        <Text style={styles.qtyText1}>
                                            Status : {''}
                                            <Text style={{ color: item.status ? 'green' : 'red' }}>
                                                {item.status ? 'Disetujui' : 'Belum disetujui'}
                                            </Text>
                                        </Text>
                                        <Text style={styles.qtyText1}>Durasi Pinjam : {item.borrowDuration} Hari</Text>
                                        {item.returnDate && (
                                            <Text style={styles.qtyText1}>Tanggal Pengembalian : {item.returnDate}</Text>
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
    );
};

export default BorrowBookByUserCard;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 40,
        marginVertical: 8,
    },
    cardContainer: {
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#D9D9D9',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 92,
        height: 100,
        borderRadius: 10,
        backgroundColor: '#747474',
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'cover',
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
        alignItems: 'center',
    },
    title: {
        fontWeight: '600',
        fontSize: 20,
        color: 'black',
        marginBottom: 8,
    },
    qty: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 12,
    },
    qtyText1: {
        fontSize: 16,
        color: '#747474',
    },
    qtyText2: {
        fontSize: 12,
        top: 8,
        color: 'tomato',
    },
    shimmer: {
        marginVertical: 8,
        width: '100%',
        height: 80,
    },
});
