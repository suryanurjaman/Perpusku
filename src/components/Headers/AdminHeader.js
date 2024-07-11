import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/AntDesign';

const AdminHeader = ({ icon1, icon2, tittle, size, onIcon1Press, onIcon2Press }) => {
    return (
        <View style={styles.container} >
            <View style={styles.headerContainer}>
                <View style={styles.textContainer}>
                    <Text style={styles.text} >{tittle}</Text>
                </View>
                <View style={styles.iconContainer}>
                    {icon1 &&
                        <TouchableOpacity onPress={onIcon1Press}>
                            <View style={styles.image}>
                                <Icon name={icon1} size={size} color="#747474" />
                            </View>
                        </TouchableOpacity>
                    }
                    {icon2 && (
                        <TouchableOpacity onPress={onIcon2Press}>
                            <View style={styles.image}>
                                <Icon name={icon2} size={24} color="#747474" />
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

        </View>
    )
}

export default AdminHeader

const styles = StyleSheet.create({
    container: {
        marginTop: 50,
        marginBottom: 32
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 50,
    },
    textContainer: {
        flexDirection: 'row',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 30,
        fontStyle: 'italic'
    },
    iconContainer: {
        flexDirection: 'row',
        gap: 12
    },
    image: {
        backgroundColor: '#D9D9D9',
        width: 40,
        height: 40,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
})