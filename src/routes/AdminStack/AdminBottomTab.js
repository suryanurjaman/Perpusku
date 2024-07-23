import { StyleSheet } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native'
import AdminHomeStack from './AdminHomeStack'
import AdminAddUserStack from './AdminAddUserStack'
import AdminBorrowBookStack from './AdminBorrowBookStack'
import AdminIcon from '../../components/AdminIcons/AdminIcons'
import AdminReportStack from './AdminReportStack'


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
                        <AdminIcon isHome={true} focused={focused} />
                    )
                },
                tabBarHideOnKeyboard: true,
            })} />
            <Tab.Screen name='AddUserStack' component={AdminAddUserStack} options={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    return (
                        <AdminIcon isUser={true} focused={focused} />
                    )
                },
                tabBarHideOnKeyboard: true,
            })} />
            <Tab.Screen name='AdminBorrowBookStack' component={AdminBorrowBookStack} options={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    return (
                        <AdminIcon isBook={true} focused={focused} />
                    )
                },
                tabBarHideOnKeyboard: true,
            })} />
            <Tab.Screen name='AdminBorrowReportStack' component={AdminReportStack} options={({ route }) => ({
                tabBarIcon: ({ focused }) => {
                    return (
                        <AdminIcon isReport={true} focused={focused} />
                    )
                },
                tabBarHideOnKeyboard: true,
            })} />
        </Tab.Navigator>
    )
}

export default AdminBottomTab

const styles = StyleSheet.create({})