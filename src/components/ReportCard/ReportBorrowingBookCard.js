import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

const ReportBorrowingBookCard = ({ refreshing, users, item }) => {
    const navigation = useNavigation()
    const handleGotoDetailPeminjaman = () => {
        navigation.navigate("DetailReportBorrowBookPage");
    };
    const handleGotoDetailBuku = () => {
        navigation.navigate("DetailReportBook");
    };
    const handleGotoDetailUser = () => {
        navigation.navigate("DetailReportUser");
    };
    return (
        <View>
            <TouchableOpacity onPress={handleGotoDetailPeminjaman}>
                <View style={styles.container}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.title}>Laporan Peminjaman</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGotoDetailBuku}>
                <View style={styles.container}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.title}>Laporan Inventarisasi</Text>
                    </View>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleGotoDetailUser}>
                <View style={styles.container}>
                    <View style={styles.cardContainer}>
                        <Text style={styles.title}>Laporan Keanggotaan</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default ReportBorrowingBookCard;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginHorizontal: 40,
        marginVertical: 8,
    },
    cardContainer: {
        borderRadius: 10,
        padding: 60,
        backgroundColor: '#D9D9D9',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontWeight: '600',
        fontSize: 20,
        color: 'black',
        marginBottom: 8,
    },
    shimmer: {
        marginVertical: 8,
        width: '100%',
        height: 80,
    },
});
