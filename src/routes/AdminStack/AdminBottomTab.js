import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import AdminHomeIcon from '../../components/AdminHomeIcon/AdminHomeIcon'
import AdminAddUserIcon from '../../components/AdminAddUserIcon/AdminAddUserIcon'
import AdminHomeStack from './AdminHomeStack'
import AdminAddUserStack from './AdminAddUserStack'

const Tab = createBottomTabNavigator()

const getRouteName = route => {
    const routeName = getFocusedRouteNameFromRoute(route);
    // Jika tidak ada nama rute fokus, kembalikan nilai default
    if (!routeName || routeName === 'HomePage') {
        return 'flex';
    }
    return 'none';
}

const AdminBottomTab = () => {
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
            <Tab.Screen name='HomeStack' component={AdminHomeStack} options={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    return (
                        <AdminHomeIcon focused={focused} />
                    )
                },
                tabBarHideOnKeyboard: true,
            })} />
            <Tab.Screen name='AddUserStack' component={AdminAddUserStack} options={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    return (
                        <AdminAddUserIcon focused={focused} />
                    )
                },
                tabBarHideOnKeyboard: true,
            })} />
        </Tab.Navigator>
    )
}

export default AdminBottomTab

const styles = StyleSheet.create({})