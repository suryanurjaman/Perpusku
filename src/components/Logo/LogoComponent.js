import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';
import logo from '../../assets/image/logo.png'


const LogoComponent = () => {
    return (
        <View style={styles.container}>
            <Image source={logo} style={styles.logoImage} />
            <Text style={styles.logoText}>Perpusku.</Text>
        </View>
    );
};

export default LogoComponent;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoImage: {
        width: 100,  // Ubah sesuai dengan ukuran gambar Anda
        height: 100, // Ubah sesuai dengan ukuran gambar Anda
    },
    logoText: {
        fontWeight: 'bold',
        fontSize: 40,
        color: '#141218',
        marginTop: 10,  // Menambahkan jarak antara gambar dan teks
    },
});
