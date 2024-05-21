import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import AdminInputBookHeader from '../../components/Headers/AdminInputBookHeader'
import AddUserPage from '../../screens/AdminScreen/Pages/AddUserPage'
import AddNewUser from '../../screens/AdminScreen/Pages/AddNewUser'
import EditUserPage from '../../screens/AdminScreen/Pages/EditUserPage'

const Stack = createNativeStackNavigator()

const AdminAddUserStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                options={{ headerShown: false }}
                name='HomePage'
                component={AddUserPage}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Input data User' />
                }}
                name='AddUser'
                component={AddNewUser}
            />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader  {...props} title='Edit data User' navigateTo='HomePage' />
                }}
                name='EditUser'
                component={EditUserPage}
            />
        </Stack.Navigator>
    )
}

export default AdminAddUserStack