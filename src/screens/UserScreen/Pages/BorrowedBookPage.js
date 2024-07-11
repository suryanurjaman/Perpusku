import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AdminHeader from '../../../components/Headers/AdminHeader'
import BorrowBookCard from '../../../components/BorrowBookCard/BorrowBookCard'
import BorrowBookByUserCard from '../../../components/BorrowBookCard/BorrowBookByUserCard'
import CategoryComponent from '../../../components/Category/CategoryComponent'
import { useSelector } from 'react-redux'

const BorrowBookPage = () => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const borrowedBooks = useSelector(state => state.borrowBook.borrowedBook);
    console.log('====================================');
    console.log('boookk :', borrowedBooks);
    console.log('====================================');
    // Mendapatkan set dari nilai unik status buku
    const uniqueStatuses = new Set(borrowedBooks.map(book => book.ongoing));

    // Membuat array kategori berdasarkan nilai unik yang ada dalam set
    const categories = ['All'];
    if (borrowedBooks.some(book => book.ongoing)) {
        categories.push('Belum Selesai');
    }
    if (borrowedBooks.some(book => !book.ongoing)) {
        categories.push('Selesai');
    }
    const handleCategorySelect = (category) => {
        if (category === 'All') {
            setSelectedCategory(null); // Jika kategori "All" dipilih, atur selectedCategory menjadi null
        } else if (category === 'Belum Selesai') {
            setSelectedCategory(true); // Jika kategori "Belum Selesai" dipilih, atur selectedCategory menjadi true
        } else if (category === 'Selesai') {
            setSelectedCategory(false); // Jika kategori "Selesai" dipilih, atur selectedCategory menjadi false
        }
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
            <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
            <BorrowBookByUserCard
                selectedCategory={selectedCategory}
            />
        </ScrollView>
    )
}

export default BorrowBookPage

const styles = StyleSheet.create({})