import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomePage } from '../../screens/AdminScreen'
import AddBookData from '../../screens/AdminScreen/Pages/AddBookData'
import AdminInputBookHeader from '../../components/Headers/AdminInputBookHeader'
import EditBookPage from '../../screens/AdminScreen/Pages/EditBookPage'
import EditProfilePage from '../../screens/AdminScreen/Pages/EditProfilePage'

const Stack = createNativeStackNavigator()

const AdminHomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name='HomePage'
                component={HomePage}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Input data buku' />
                }}
                name='AddBook'
                component={AddBookData}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Edit profile'
                        navigateTo='HomePage'
                    />
                }}
                name='EditProfile'
                component={EditProfilePage}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Edit data buku'
                        navigateTo='HomePage' />
                }}
                name='EditBook'
                component={EditBookPage}
            />
        </Stack.Navigator>
    )
}

export default AdminHomeStack