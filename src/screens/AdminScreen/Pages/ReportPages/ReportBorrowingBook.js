import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AdminHeader from '../../../../components/Headers/AdminHeader'
import ReportBorrowingBookCard from '../../../../components/ReportCard/ReportBorrowingBookCard'

const ReportBorrowingBook = () => {
    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl />}
        >
            <AdminHeader
                tittle='Laporan'
                size={24}
            />
            <ReportBorrowingBookCard />
        </ScrollView>
    )
}

export default ReportBorrowingBook

const styles = StyleSheet.create({})