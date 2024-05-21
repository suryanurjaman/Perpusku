import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import UserStack from './UserStack'

const Tab = createBottomTabNavigator()

const UserBottomTab = () => {
    return (
        <Tab.Navigator>
            <Tab.Screen name='Home' component={UserStack} />
        </Tab.Navigator>
    )
}

export default UserBottomTab

const styles = StyleSheet.create({})