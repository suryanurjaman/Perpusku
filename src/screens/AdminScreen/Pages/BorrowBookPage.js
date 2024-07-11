import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AdminHeader from '../../../components/Headers/AdminHeader'
import BookCardComponent from '../../../components/BookCard/BookCardComponent'
import UserCardComponent from '../../../components/UserCard/UserCardComponent'
import BorrowBookCard from '../../../components/BorrowBookCard/BorrowBookCard'

const BorrowBookPage = () => {
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl />}
        >
            <AdminHeader
                tittle='Pinjaman Buku'
                size={24}
            />
            <BorrowBookCard />
        </ScrollView>
    )
}

export default BorrowBookPage

const styles = StyleSheet.create({})