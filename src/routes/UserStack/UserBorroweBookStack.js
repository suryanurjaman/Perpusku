import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import BorrowBookPage from '../../screens/UserScreen/Pages/BorrowedBookPage'
import AdminInputBookHeader from '../../components/Headers/AdminInputBookHeader'
import DetailBorrowBookPageUser from '../../screens/UserScreen/Pages/DetailBorrowBookPageUser'


const Stack = createNativeStackNavigator()

const UserBorroweBookStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='HomePage' component={BorrowBookPage} />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Detail Peminjaman'
                        navigateTo='HomePage'
                    />
                }}
                name='DetailBorrowBookPageUser'
                component={DetailBorrowBookPageUser}
            />
        </Stack.Navigator>
    )
}

export default UserBorroweBookStack

const styles = StyleSheet.create({})