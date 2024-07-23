import React, { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import AdminHeader from '../../../components/Headers/AdminHeader';
import CategoryComponent from '../../../components/Category/CategoryComponent';
import SearchInputComponent from '../../../components/TextInput/SearchInputComponent';
import BorrowBookByUserCard from '../../../components/BorrowBookCard/BorrowBookByUserCard';
import { useSelector } from 'react-redux';

const BorrowBookPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const borrowedBooks = useSelector(state => state.borrowBook.borrowedBook);

    // Membuat array kategori berdasarkan nilai unik yang ada dalam set
    const categories = ['All'];
    if (borrowedBooks.some(book => book.ongoing)) {
        categories.push('Belum Selesai');
    }
    if (borrowedBooks.some(book => !book.ongoing)) {
        categories.push('Selesai');
    }

    // Fungsi untuk menghandle pemilihan kategori
    const handleCategorySelect = (category) => {
        if (category === 'All') {
            setSelectedCategory(null);
        } else if (category === 'Belum Selesai') {
            setSelectedCategory(true);
        } else if (category === 'Selesai') {
            setSelectedCategory(false);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl />}
        >
            <AdminHeader
                tittle='Pinjaman Buku'
                size={24}
            />
            <SearchInputComponent value={searchQuery} onChangeText={handleSearch} />
            <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
            <BorrowBookByUserCard
                selectedCategory={selectedCategory}
                refreshing={false} // Pastikan refreshing disesuaikan dengan kebutuhan
                searchQuery={searchQuery}
            />
        </ScrollView>
    );
};

export default BorrowBookPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
