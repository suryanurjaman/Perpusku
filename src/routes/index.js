import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import AuthStack from './AuthStack'
import { useDispatch, useSelector } from 'react-redux'
import { Init } from '../redux/actions/AuthAction'
import AdminBottomTab from './AdminStack/AdminBottomTab'
import UserBottomTab from './UserStack/UserBottomTab'

const RootNavigation = () => {
    const role = useSelector(state => state.auth.role);
    console.log('role', role)

    const dispatch = useDispatch();
    const init = async () => {
        await dispatch(Init());
    };
    useEffect(() => {
        init();
    }, []);
    return (
        <NavigationContainer>
            {role === null ? (
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