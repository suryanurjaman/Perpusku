import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import AdminHeader from '../../../components/Headers/AdminHeader';
import SearchInputComponent from '../../../components/TextInput/SearchInputComponent';
import UserCardComponent from '../../../components/UserCard/UserCardComponent';
import { useDispatch } from 'react-redux';
import { fetchUsers } from '../../../redux/actions/UserAction';

const Label = ({ text, isFocused }) => (
    <View style={[styles.labelContainer, isFocused && styles.labelContainerFocused]}>
        <Text style={[styles.label, isFocused && styles.labelFocused]}>{text}</Text>
    </View>
);

const AddUserPage = ({ onSubmit, navigation }) => {

    const onIcon1Press = () => {
        navigation.navigate('AddUser')
    }

    return (
        <ScrollView
            style={styles.container}
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