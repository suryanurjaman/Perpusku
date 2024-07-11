import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack'
import { useDispatch, useSelector } from 'react-redux'
import { Init, autoLogin } from '../redux/actions/AuthAction'
import AdminBottomTab from './AdminStack/AdminBottomTab'
import UserBottomTab from './UserStack/UserBottomTab'

const RootNavigation = () => {
    const dispatch = useDispatch();
    const role = useSelector(state => state.auth.userData?.role);
    console.log('role nyahhh', role)

    useEffect(() => {
        dispatch(autoLogin());
    }, []);

    return (
        <NavigationContainer>
            {role === null || role === undefined ? (
                <AuthStack />
            ) : (
                <>
                    {role === 'Admin' ? (
                        <AdminBottomTab />
                    ) : (
                        <UserBottomTab />
                    )}
                </>
            )}
        </NavigationContainer>

    )
}

export default RootNavigation

const styles = StyleSheet.create({})