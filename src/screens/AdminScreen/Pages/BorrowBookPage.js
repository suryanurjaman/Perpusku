import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import AdminHeader from '../../../components/Headers/AdminHeader';
import BorrowBookCard from '../../../components/BorrowBookCard/BorrowBookCard';
import SearchInputComponent from '../../../components/TextInput/SearchInputComponent';
import { useSelector } from 'react-redux';
import CategoryComponent from '../../../components/Category/CategoryComponent';

const BorrowBookPage = () => {
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const borrowedBooks = useSelector(state => state.borrowBook.allBorrowedBook);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    // Filter data berdasarkan query pencarian dan status pinjaman
    const filteredBorrowedBooks = borrowedBooks.filter((item) =>
        item.user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (selectedCategory === 'All' ||
            (selectedCategory === 'Disetujui' && item.request.approved) ||
            (selectedCategory === 'Belum Disetujui' && !item.request.approved) ||
            (selectedCategory === 'Selesai' && item.request.returned) ||
            (selectedCategory === 'Menunggu Pengembalian' && !item.request.returned && item.request.approved && item.request.ongoing))
    );

    const categories = ['All', 'Disetujui', 'Belum Disetujui', 'Selesai', 'Menunggu Pengembalian']; // Kategori berdasarkan status pinjaman

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { }} />}
        >
            <AdminHeader
                tittle='Pinjaman Buku'
                size={24}
            />
            <SearchInputComponent value={searchQuery} onChangeText={handleSearch} />
            <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
            <BorrowBookCard refreshing={refreshing} borrowedBooks={filteredBorrowedBooks} />
        </ScrollView>
    );
};

export default BorrowBookPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
