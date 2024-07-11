import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BorrowBookPage from '../../screens/AdminScreen/Pages/BorrowBookPage'
import DetailBorrowBookPage from '../../screens/AdminScreen/Pages/DetailBorrowBookPage'
import AdminInputBookHeader from '../../components/Headers/AdminInputBookHeader'


const Stack = createNativeStackNavigator()

const AdminBorrowBookStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name='HomePage'
                component={BorrowBookPage}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Detail Peminjaman'
                        navigateTo='HomePage'
                    />
                }}
                name='DetailBorrowBookPage'
                component={DetailBorrowBookPage}
            />
        </Stack.Navigator>
    )
}

export default AdminBorrowBookStack