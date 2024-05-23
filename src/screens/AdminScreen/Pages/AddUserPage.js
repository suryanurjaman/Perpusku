import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import AdminHeader from '../../../components/Headers/AdminHeader';
import SearchInputComponent from '../../../components/TextInput/SearchInputComponent';
import UserCardComponent from '../../../components/UserCard/UserCardComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../redux/actions/UserAction';
import auth from '@react-native-firebase/auth';

const AddUserPage = ({ navigation }) => {
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = React.useState(false);
    const user = auth().currentUser;
    const users = useSelector(state => state.user.users);
    console.log('Data terupdate :', users)

    const onIcon1Press = () => {
        navigation.navigate('AddUser')
    }

    const onRefresh = useCallback(() => {
        console.log('Pull to refresh triggered');
        setRefreshing(true);
        if (user) {
            const userId = user.uid;
            dispatch(fetchUsers(userId))
                .then(() => {
                    console.log('Data fetched successfully');
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    setTimeout(() => {
                        setRefreshing(false);
                    }, 1000);
                });
        } else {
            setRefreshing(false);
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            const userId = user.uid;
            dispatch(fetchUsers(userId))
        }
        console.log('Data terupdate :', users)
    }, [dispatch])

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <AdminHeader
                tittle='Data User'
                icon1='adduser'
                size={24}
                onIcon1Press={onIcon1Press}
            />
            <SearchInputComponent />
            <Text style={styles.textTitle}>User</Text>
            <UserCardComponent
                refreshing={refreshing}
            />
        </ScrollView>
    );
};


export default AddUserPage;

const styles = StyleSheet.create({
    textTitle: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 12,
        marginLeft: 46,
    }
});