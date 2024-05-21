// ModalComponent.js
import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon2 from 'react-native-vector-icons/FontAwesome';
import ButtonComponent from '../Button/ButtonComponent';
import { useDispatch } from 'react-redux';
import { Logout } from '../../redux/actions/AuthAction';
import ThreeDotComponent from '../ThreeDot/ThreeDotComponent';

const ModalComponent = ({ dataValue, modalVisible, hideModal, title, isProfile, isBook }) => {
    const dispatch = useDispatch();

    console.log('userdata: ', dataValue)

    const setLogout = () => {
        dispatch(Logout());
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={hideModal}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.headContainer}>
                        <TouchableOpacity onPress={hideModal}>
                            <Icon
                                style={styles.closeButton}
                                name='close'
                                size={24}
                            />
                        </TouchableOpacity>
                        <Text style={styles.detail}>
                            {title}
                        </Text>
                        <ThreeDotComponent
                            dataValue={dataValue}
                            dataType={isProfile ? 'profile' : isBook ? 'book' : 'user'}
                            hideModal={hideModal}
                        />
                    </View>
                    <View style={styles.imageContainer}>
                        {isBook ? (
                            dataValue.imageUrl ? (
                                <Image style={styles.imageBook} source={{ uri: dataValue.imageUrl }} />
                            ) : (
                                <Icon name="user" style={styles.imageIcon} />
                            )
                        ) : (
                            dataValue.imageUrl ? (
                                <Image style={styles.image} source={{ uri: dataValue.imageUrl }} />
                            ) : (
                                <View style={styles.imageIcon}>
                                    <Icon2 size={40} name="image" />
                                </View>
                            )
                        )}
                        <Text style={styles.modalTitle}>{dataValue.title || dataValue.username || dataValue.name}</Text>
                        <Text style={styles.author}>{isBook ? `Penulis: ${dataValue.author}` : dataValue.role}</Text>
                        {isBook && <Text style={styles.stock}>{isBook ? `Stock: ${dataValue.stock}` : ''}</Text>}
                    </View>
                    <View style={styles.HeadContent}>
                        <Text style={styles.about}>{isBook ? 'About the Book' : 'Email'}</Text>
                        {isBook ? (
                            <View style={{ maxHeight: 100 }}>
                                <ScrollView>
                                    <Text style={styles.description}>{dataValue.description}</Text>
                                </ScrollView>
                            </View>
                        ) : (
                            <Text style={styles.description}>{dataValue.email}</Text>
                        )}
                        {isBook && (
                            <View>
                                <Text style={styles.about}>Penerbit</Text>
                                <View style={{ maxHeight: 100 }}>
                                    <ScrollView>
                                        <Text style={styles.description}>{dataValue.publisher}</Text>
                                    </ScrollView>
                                </View>
                            </View>
                        )}
                    </View>

                    {isProfile && (
                        <View style={styles.footContainer}>
                            <ButtonComponent onPress={setLogout} styleText={styles.buttonText} style={styles.button} title='Log out' />
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

export default ModalComponent;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 328,
        backgroundColor: 'white',
        padding: 30,
        margin: 20,
        borderRadius: 10,
    },
    headContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 100,
        marginBottom: 16,
        backgroundColor: 'tomato'
    },
    imageIcon: {
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#9D9D9D'
    },
    imageBook: {
        width: 160,
        height: 220,
        borderRadius: 10,
        marginBottom: 16,
        backgroundColor: 'tomato'
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4
    },
    author: {
        fontSize: 16,
        color: '#9D9D9D',
        marginBottom: 8
    },
    stock: {
        color: '#9D9D9D',
    },
    detail: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center'
    },
    about: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4
    },
    description: {
        fontSize: 16,
        color: '#9D9D9D',
        textAlign: 'justify',
        marginBottom: 20
    },
    footContainer: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        paddingVertical: 16,
    }
});
