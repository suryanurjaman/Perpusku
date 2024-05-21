import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ModalComponent from '../Modal/ModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../../redux/actions/UserAction';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const UserCardComponent = () => {
    const users = useSelector(state => state.user.users);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const showModal = (user) => {
        setSelectedUser(user);
        setModalVisible(true);
    };

    return (
        <View>

            {users.map((userData) => (
                <TouchableOpacity key={userData.id} onPress={() => showModal(userData)}>
                    <View style={styles.container}>
                        <View style={styles.cardContainer}>
                            {userData.imageUrl ? (
                                <View style={styles.image}>
                                    <Image source={{ uri: userData.imageUrl }} style={styles.imageStyle} />
                                </View>
                            ) : (
                                <View style={styles.image}>
                                    <Icon name='image' size={34} />
                                </View>
                            )}
                            <View style={styles.detailContainer}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>{userData.username}</Text>
                                </View>
                                <View style={styles.qty}>
                                    <Text style={styles.qtyText1}>{userData.role}</Text>
                                    <Text style={styles.qtyText2}>Tap to see details</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}


            {selectedUser && (
                <ModalComponent
                    dataValue={selectedUser}
                    modalVisible={modalVisible}
                    hideModal={() => setModalVisible(false)}
                    title='Detail user'
                />
            )}
        </View>
    );
};

export default UserCardComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 40,
        marginVertical: 8
    },
    cardContainer: {
        borderRadius: 10,
        padding: 12,
        backgroundColor: '#D9D9D9',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: 10,
        backgroundColor: '#747474',
        alignItems: 'center',
        justifyContent: 'center',
        resizeMode: 'cover'
    },
    imageStyle: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    detailContainer: {
        flex: 1,
        marginLeft: 16
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontWeight: '600',
        fontSize: 16,
        color: 'black'
    },
    qty: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 12,
    },
    qtyText1: {
        color: '#747474'
    },
    qtyText2: {
        fontSize: 12,
        top: 8,
        color: 'tomato'
    },
    shimmer: {
        marginVertical: 8,
        width: '100%',
        height: 80
    }
});
