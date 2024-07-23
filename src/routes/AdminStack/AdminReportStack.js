import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ReportBorrowingBook from '../../screens/AdminScreen/Pages/ReportPages/ReportBorrowingBook'
import AdminInputBookHeader from '../../components/Headers/AdminInputBookHeader'
import DetailReportBorrowBookPage from '../../screens/AdminScreen/Pages/ReportPages/DetailReportBorrowBookPage'
import DetailReportBook from '../../screens/AdminScreen/Pages/ReportPages/DetailReportBook'
import DetailReportUser from '../../screens/AdminScreen/Pages/ReportPages/DetailReportUser'

const Stack = createNativeStackNavigator()

const AdminReportStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name='HomePage'
                component={ReportBorrowingBook}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Laporan Peminjaman'
                        navigateTo='HomePage'
                    />
                }}
                name='DetailReportBorrowBookPage'
                component={DetailReportBorrowBookPage}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Laporan Buku'
                        navigateTo='HomePage'
                    />
                }}
                name='DetailReportBook'
                component={DetailReportBook}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Laporan Anggota'
                        navigateTo='HomePage'
                    />
                }}
                name='DetailReportUser'
                component={DetailReportUser}
            />
        </Stack.Navigator>
    )
}

export default AdminReportStack

const styles = StyleSheet.create({})