import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/FontAwesome6'

const AdminInputBookHeader = ({ navigation, title, navigateTo }) => {

    const handleChevronPress = () => {
        if (navigateTo) {
            navigation.replace(navigateTo); // Navigate to the specified screen
        } else {
            navigation.goBack(); // Navigate back by default
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity styles={styles.icon} onPress={handleChevronPress}>
                <View>
                    <Icon name='chevron-left' size={24} />
                </View>
            </TouchableOpacity>
            <View style={styles.textContainer}>
                <Text style={styles.text}>
                    {title}
                </Text>
            </View>
        </View>
    )
}

export default AdminInputBookHeader

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 50,
        marginTop: 52,
        marginBottom: 32,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 24,
        textAlign: 'center'
    },
    textContainer: {
        zIndex: -99,
        flex: 1,
        marginLeft: -16
    }
})