import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import UserStack from './UserStack'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import AdminIcon from '../../components/AdminIcons/AdminIcons'
import UserBorroweBookStack from './UserBorroweBookStack'

const Tab = createBottomTabNavigator()

const getRouteName = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    // Jika tidak ada nama rute fokus, kembalikan nilai default
    if (!routeName || routeName === 'HomePage') {
        return 'flex';
    }
    return 'none';
}

const UserBottomTab = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    backgroundColor: '#747474',
                    height: 64,
                    paddingTop: 16,
                    paddingBottom: 12,
                    paddingHorizontal: 12,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    display: getRouteName(route)
                }
            })}
        >
            <Tab.Screen name='Home' component={UserStack}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        return (
                            <AdminIcon isHome={true} focused={focused} />
                        )
                    },
                    tabBarHideOnKeyboard: true,
                })}
            />
            <Tab.Screen name='BorrowedBook' component={UserBorroweBookStack}
                options={({ route }) => ({
                    tabBarIcon: ({ focused }) => {
                        return (
                            <AdminIcon isBook={true} focused={focused} />
                        )
                    },
                    tabBarHideOnKeyboard: true,
                })}
            />
        </Tab.Navigator>
    )
}

export default UserBottomTab

const styles = StyleSheet.create({})