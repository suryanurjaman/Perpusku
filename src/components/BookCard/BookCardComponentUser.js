import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import ModalComponent from '../Modal/ModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../../redux/actions/BookAction';
import ModalComponentUser from '../Modal/ModalComponentUser';

const BookCardComponentUser = (props) => {
    const dispatch = useDispatch();
    const book = useSelector(state => state.book.bookItems);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const filteredBooks = props.selectedCategory === 'All' ? book : book.filter(book => book.category === props.selectedCategory);

    const searchFilteredBooks = filteredBooks.filter(book => {
        const titleLower = book.title.toLowerCase();
        const queryLower = props.searchQuery.toLowerCase();
        return titleLower.includes(queryLower);
    });

    useEffect(() => {
        fetchData();
        console.log('track buku :', book)
    }, [props.refreshing]);

    const fetchData = useCallback(async () => {
        try {
            await dispatch(fetchBooks());
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    }, []);

    const showModal = (book) => {
        setSelectedBook(book);
        setModalVisible(true);
    };

    return (
        <View>
            {props.refreshing ? (
                // Shimmer placeholders while loading
                Array.from(Array(book && book.length > 0 ? book.length : 5).keys()).map((_, index) => (
                    <ShimmerPlaceholder
                        key={index}
                        style={[styles.container, styles.shimmer]}
                        duration={1000}
                        shimmerColors={['#EDEDED', '#D9D9D9', '#EDEDED']}
                        shimmerStyle={{ borderRadius: 10 }}
                    />
                ))
            ) : (
                // Render actual book data once loading is complete
                searchFilteredBooks.map(book => (
                    <TouchableOpacity key={book.id} onPress={() => showModal(book)}>
                        <View style={styles.container}>
                            <View style={styles.cardContainer}>
                                <View style={styles.image}>
                                    <Image
                                        source={{ uri: book.imageUrl }}
                                        style={styles.image}
                                    />
                                </View>
                                <View style={styles.detailContainer}>
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.title}>{book.title}</Text>
                                    </View>
                                    <Text style={styles.overview} numberOfLines={3}>{book.description}</Text>
                                    <View style={styles.qty}>
                                        <Text style={styles.qtyText1}>Stock {book.stock}</Text>
                                        <Text style={styles.qtyText2}>Tap to see details</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))
            )}
            {selectedBook && (
                <ModalComponentUser
                    dataValue={selectedBook}
                    modalVisible={modalVisible}
                    hideModal={() => setModalVisible(false)}
                    title='Detail book'
                    isBook={true}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 40,
        marginVertical: 16,
    },
    cardContainer: {
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#D9D9D9',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shimmer: {
        borderRadius: 10,
        width: 328,
        height: 100,
        backgroundColor: '',
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
        justifyContent: 'center'
    },
    detailContainer: {
        flex: 1,
        gap: 8,
        marginLeft: 12
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: '700',
        fontSize: 18,
        color: 'black'
    },
    overview: {
        color: 'black',
        fontWeight: '400',
        fontSize: 12,
        flex: 1,
    },
    qty: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 12
    },
    qtyText1: {
        color: 'black'
    },
    qtyText2: {
        fontSize: 12,
        top: 8,
        color: 'tomato'
    }
});

export default BookCardComponentUser;
