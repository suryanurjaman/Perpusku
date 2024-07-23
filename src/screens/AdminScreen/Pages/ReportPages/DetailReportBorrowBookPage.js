import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import firestore from '@react-native-firebase/firestore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { DownloadDirectoryPath, exists } from 'react-native-fs';
import ButtonComponent from '../../../../components/Button/ButtonComponent';

const DetailReportBorrowBookPage = () => {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const borrowedBooksRef = firestore().collection('borrowed_books');
                const snapshot = await borrowedBooksRef.get();
                const borrowedBooks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                // Mengambil data buku terkait buku yang dipinjam
                const bookIds = borrowedBooks.map(book => book.bookId);
                const booksRef = firestore().collection('books').where(firestore.FieldPath.documentId(), 'in', bookIds);
                const booksSnapshot = await booksRef.get();
                const booksMap = new Map(booksSnapshot.docs.map(doc => [doc.id, doc.data()]));

                // Mengambil data pengguna terkait buku yang dipinjam
                const userIds = borrowedBooks.map(book => book.userId);
                const usersRef = firestore().collection('users').where(firestore.FieldPath.documentId(), 'in', userIds);
                const usersSnapshot = await usersRef.get();
                const usersMap = new Map(usersSnapshot.docs.map(doc => [doc.id, doc.data()]));

                // Menggabungkan data untuk menyertakan judul buku, nama pengguna, dan email pengguna
                const enrichedBooks = borrowedBooks.map(book => ({
                    ...book,
                    bookTitle: booksMap.get(book.bookId)?.title || 'Judul Tidak Diketahui',
                    userName: usersMap.get(book.userId)?.username || 'Pengguna Tidak Diketahui',
                    userEmail: usersMap.get(book.userId)?.email || 'Email Tidak Diketahui',
                    isBorrowed: !book.borrowedAt || !book.returnDate // Cek jika buku masih dipinjam
                }));

                setBorrowedBooks(enrichedBooks);
                setFilteredBooks(enrichedBooks);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filterBooksByDate = () => {
        const filtered = borrowedBooks.filter(book => {
            if (book.isBorrowed) return true; // Sertakan buku yang sedang dipinjam
            const [dayMonthYear, time] = book.borrowedAt.split(' ');
            const [day, month, year] = dayMonthYear.split('/');
            const [hours, minutes] = time.split('.');
            const borrowedAt = new Date(year, month - 1, day, hours, minutes);
            return borrowedAt >= startDate && borrowedAt <= endDate;
        });
        setFilteredBooks(filtered);
    };

    const generatePDF = async () => {
        const htmlContent = `
            <html>
                <head>
                    <style>
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid black;
                            padding: 8px;
                            text-align: center;
                        }
                    </style>
                </head>
                <body>
                    <h1 style="text-align: center;">Laporan Detail Buku Dipinjam</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Pengguna</th>
                                <th>Email Pengguna</th>
                                <th>Judul Buku</th>
                                <th>Durasi Peminjaman</th>
                                <th>Dipinjam Pada</th>
                                <th>Tanggal Pengembalian</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredBooks.map(book => `
                                <tr>
                                    <td>${book.userName}</td>
                                    <td>${book.userEmail}</td>
                                    <td>${book.bookTitle}</td>
                                    <td>${book.borrowDuration}</td>
                                    <td>${book.borrowedAt || 'Sedang Dipinjam'}</td>
                                    <td>${book.returnDate || 'Sedang Dipinjam'}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const downloadDir = Platform.OS === 'android' ? '/storage/emulated/0/Download' : DownloadDirectoryPath;

        try {
            const timestamp = new Date().getTime(); // Dapatkan timestamp saat ini
            const fileName = `Laporan_Detail_Buku_Dipinjam_${timestamp}`;
            const filePath = `${downloadDir}/${fileName}.pdf`;

            const fileExists = await exists(filePath);
            if (fileExists) {
                console.log('File sudah ada:', filePath);
                Alert.alert(
                    'PDF Sudah Diunduh Sebelumnya',
                    `File PDF sudah ada di ${filePath}`,
                    [{ text: 'OK', onPress: () => console.log('OK Ditekan') }],
                    { cancelable: false }
                );
                return filePath;
            }

            const { filePath: newFilePath } = await RNHTMLtoPDF.convert({
                html: htmlContent,
                fileName,
                directory: downloadDir,
            });

            console.log('PDF dibuat:', newFilePath);
            return newFilePath;
        } catch (error) {
            console.error('Error membuat atau mengunduh PDF:', error);
            Alert.alert(
                'Pembuatan PDF Gagal',
                `Gagal membuat atau mengunduh file PDF: ${error}`,
                [{ text: 'OK', onPress: () => console.log('OK Ditekan') }],
                { cancelable: false }
            );
            return null;
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const filePath = await generatePDF();
            if (filePath) {
                console.log('Path file PDF:', filePath);
                Alert.alert(
                    'PDF Berhasil Diunduh',
                    `File PDF telah diunduh di ${filePath}`,
                    [{ text: 'OK', onPress: () => console.log('OK Ditekan') }],
                    { cancelable: false }
                );
            } else {
                console.log('Gagal membuat PDF');
            }
        } catch (error) {
            console.error('Error mengunduh PDF:', error);
            Alert.alert(
                'Error',
                `Gagal mengunduh PDF: ${error}`,
                [{ text: 'OK', onPress: () => console.log('OK Ditekan') }],
                { cancelable: false }
            );
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.userName}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.userEmail}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.bookTitle}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.borrowDuration}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.borrowedAt || 'Sedang Dipinjam'}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.returnDate || 'Sedang Dipinjam'}</Text>
            </View>
        </View>
    );

    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Laporan Detail Buku Dipinjam</Text>
            <View style={styles.datePicker}>
                <Button title={`Tanggal Mulai: ${formatDate(startDate)}`} onPress={() => setShowStartPicker(true)} />
                {showStartPicker && (
                    <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowStartPicker(false);
                            if (date) {
                                setStartDate(date);
                            }
                        }}
                    />
                )}
                <Button title={`Tanggal Akhir: ${formatDate(endDate)}`} onPress={() => setShowEndPicker(true)} />
                {showEndPicker && (
                    <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            setShowEndPicker(false);
                            if (date) {
                                setEndDate(date);
                            }
                        }}
                    />
                )}
                <Button title="Filter" onPress={filterBooksByDate} />
            </View>
            <View style={styles.tableHeader}>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Nama Pengguna</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Email Pengguna</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Judul Buku</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Durasi Peminjaman</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Dipinjam Pada</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Tanggal Pengembalian</Text>
                </View>
            </View>
            <FlatList
                data={filteredBooks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <ButtonComponent styleText={styles.buttonText} title="Unduh PDF" onPress={handleDownloadPDF} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    datePicker: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f2f2f2',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    headerCell: {
        flex: 1,
        alignItems: 'center',
    },
    headerText: {
        fontWeight: 'bold',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    cell: {
        flex: 1,
        alignItems: 'center',
    },
    cellText: {
        textAlign: 'center',
    },
    buttonText: {
        marginVertical: 16,
    },
});

export default DetailReportBorrowBookPage;
