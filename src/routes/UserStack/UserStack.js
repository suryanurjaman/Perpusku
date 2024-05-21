import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomePage } from '../../screens/UserScreen'

const Stack = createNativeStackNavigator()

const UserStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={HomePage} />
        </Stack.Navigator>
    )
}

export default UserStack

const styles = StyleSheet.create({})