import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomePage } from '../../screens/UserScreen'
import EditUserProfilePage from '../../screens/UserScreen/Pages/EditUserProfilePage'
import AdminInputBookHeader from '../../components/Headers/AdminInputBookHeader'
import SignIn from '../../screens/SignInScreen'

const Stack = createNativeStackNavigator()

const UserStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen options={{ headerShown: false }} name='HomePage' component={HomePage} />
            <Stack.Screen
                options={{
                    header: (props) => <AdminInputBookHeader {...props} title='Edit profile'
                        navigateTo='HomePage'
                    />
                }}
                name='EditProfile'
                component={EditUserProfilePage}
            />
            <Stack.Screen name='Login' component={SignIn} />
        </Stack.Navigator>
    )
}

export default UserStack

const styles = StyleSheet.create({})