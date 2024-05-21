import { Text, StyleSheet, View, ScrollView, Button, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchInputComponent from '../../../components/TextInput/SearchInputComponent';
import AdminHeader from '../../../components/Headers/AdminHeader';
import CategoryComponent from '../../../components/Category/CategoryComponent';
import BookCardComponent from '../../../components/BookCard/BookCardComponent'
import ModalComponent from '../../../components/Modal/ModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBooks } from '../../../redux/actions/BookAction';

const HomePage = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const bookData = useSelector(state => state.book.bookItems);
    const categories = ['All', ...Array.from(new Set(bookData.map(book => book.category)))];
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = React.useState(false);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true); // Pastikan refreshing disetel ke true di sini
        dispatch(fetchBooks())
            .then(() => {
                setTimeout(() => {
                    setRefreshing(false); // Pastikan refreshing disetel ke false setelah selesai, dengan penanganan waktu
                }, 1000); // Tunggu 1 detik sebelum mengubah refreshing kembali ke false
            })
            .catch(() => {
                setTimeout(() => {
                    setRefreshing(false); // Pastikan refreshing disetel ke false setelah selesai, dengan penanganan waktu
                }, 1000); // Tunggu 1 detik sebelum mengubah refreshing kembali ke false
            });
    }, [dispatch]);

    const userData = useSelector(state => state.auth.userData);
    const [modalVisible, setModalVisible] = useState(false);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    useEffect(() => {
        dispatch(fetchBooks())
    }, [dispatch])

    const onIcon1Press = () => {
        navigation.navigate('AddBook')
    }

    const onIcon2Press = () => {
        setModalVisible(true);
    }
    return (
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.container}>
                <AdminHeader
                    icon1='addfile'
                    icon2='user'
                    tittle='Hi, Admin'
                    size={18}
                    onIcon1Press={onIcon1Press}
                    onIcon2Press={onIcon2Press}
                />
                <SearchInputComponent
                    placeholder='Search...'
                    onChangeText={handleSearch}
                />
                <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
                <View>
                    <Text style={styles.textTitle}>Data Buku</Text>
                    <BookCardComponent
                        refreshing={refreshing}
                        selectedCategory={selectedCategory}
                        searchQuery={searchQuery}
                    />
                </View>
                <ModalComponent
                    dataValue={userData}
                    modalVisible={modalVisible}
                    hideModal={() => setModalVisible(false)}
                    title='Profile'
                    isProfile={true}
                />
            </View>
        </ScrollView>
    )
}

export default HomePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 12,
        marginLeft: 46,
    }
})