import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import AdminHeader from '../../../components/Headers/AdminHeader';
import SearchInputComponent from '../../../components/TextInput/SearchInputComponent';
import UserCardComponent from '../../../components/UserCard/UserCardComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../../redux/actions/UserAction';
import auth from '@react-native-firebase/auth';
import CategoryComponent from '../../../components/Category/CategoryComponent';

const AddUserPage = ({ navigation }) => {
    const dispatch = useDispatch();
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const user = auth().currentUser;
    const users = useSelector(state => state.user.users);

    const categories = ['All', 'Admin', 'User']; // Define your user roles here

    const onIcon1Press = () => {
        navigation.navigate('AddUser');
    };

    const onIcon2Press = () => {
        navigation.navigate('AddSiswa');
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        if (user) {
            const userId = user.uid;
            dispatch(fetchUsers(userId))
                .then(() => {
                    setRefreshing(false);
                })
                .catch(() => {
                    setRefreshing(false);
                });
        } else {
            setRefreshing(false);
        }
    }, [dispatch, user]);

    useEffect(() => {
        if (user) {
            const userId = user.uid;
            dispatch(fetchUsers(userId));
        }
    }, [dispatch, user]);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const filteredUsers = users.filter((user) => {
        const matchesSearchQuery = user.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || user.role === selectedCategory;
        return matchesSearchQuery && matchesCategory;
    });

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <AdminHeader
                tittle='Data User'
                icon1='adduser'
                icon2='plus'
                size={24}
                onIcon1Press={onIcon1Press}
                onIcon2Press={onIcon2Press}
            />
            <SearchInputComponent value={searchQuery} onChangeText={handleSearch} />
            <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
            <Text style={styles.textTitle}>User</Text>
            <UserCardComponent refreshing={refreshing} users={filteredUsers} />
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
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
