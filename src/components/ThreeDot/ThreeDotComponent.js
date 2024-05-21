import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons'
import Icon2 from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { deleteBook } from '../../redux/actions/BookAction'

const ThreeDotComponent = ({ dataValue, dataType, hideModal }) => {
    const dispatch = useDispatch();
    const [isPopoverVisible, setPopoverVisible] = useState(false);
    const navigation = useNavigation();

    console.log('datatype', dataType)
    console.log('data', dataValue)
    const handleDotsPress = () => {
        setPopoverVisible(!isPopoverVisible);
    };

    const handleEditPress = () => {
        if (dataType === 'profile') {
            navigation.navigate('EditProfile', { dataValue: dataValue });
        } else if (dataType === 'book') {
            navigation.navigate('EditBook', { dataValue: dataValue });
        } else if (dataType === 'user') {
            navigation.navigate('EditUser', { dataValue: dataValue });
        }
        setPopoverVisible(false);
        hideModal();
    };

    const handleDeletePress = () => {
        // Panggil aksi deleteBook dengan id buku dan URL gambar
        if (dataType === 'book') {
            console.log("Deleting book:", dataValue.id);
            dispatch(deleteBook(dataValue.id, dataValue.imageUrl));

        } else if (dataType === 'user') {
            console.log("Deleting User:", dataValue.id);
            dispatch(deleteUser(dataValue.id, dataValue.imageUrl));
        }
        hideModal();
    };
    return (
        <View>
            <View style={styles.dotsContainer}>
                <TouchableOpacity onPress={handleDotsPress}>
                    <View style={styles.icon}>
                        <Icon1 name='dots-vertical' size={28} />
                    </View>
                </TouchableOpacity>
                {isPopoverVisible && (
                    <View style={styles.popover}>
                        <TouchableOpacity onPress={handleEditPress}>
                            <View style={styles.popoverOption}>
                                <Icon2 name='edit' size={20} />
                                <Text style={styles.text}>Edit</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDeletePress}>
                            <View style={styles.popoverOption}>
                                <Icon2 name='delete' size={20} />
                                <Text style={styles.text}>Delete</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    )
}

export default ThreeDotComponent

const styles = StyleSheet.create({
    dotsContainer: {
        flexDirection: 'row',
        position: 'relative',
    },
    popover: {
        position: 'absolute',
        top: 36,
        left: -30,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 4,
        shadowColor: 'tomato',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 4,
    },
    popoverOption: {
        alignItems: 'center',
        marginVertical: 8,
        flexDirection: 'row',
        gap: 8
    },
    text: {
        fontSize: 16
    }
})