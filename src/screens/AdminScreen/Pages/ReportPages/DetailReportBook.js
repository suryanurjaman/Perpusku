import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Button, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { DownloadDirectoryPath, exists } from 'react-native-fs';
import ButtonComponent from '../../../../components/Button/ButtonComponent';

const DetailReportBook = () => {
    const [booksData, setBooksData] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksRef = firestore().collection('books');
                const snapshot = await booksRef.get();
                const booksData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    dateAdded: doc.data().dateAdded.toDate(), // Konversi timestamp Firestore ke JavaScript Date
                }));

                setBooksData(booksData);
                setFilteredBooks(booksData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const filterBooksByDate = () => {
        const filtered = booksData.filter(book => {
            return book.dateAdded >= startDate && book.dateAdded <= endDate;
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
                    <h1 style="text-align: center;">Detail Report Books</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Date Added</th>
                                <th>Publisher</th>
                                <th>Stock</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredBooks.map(book => `
                                <tr>
                                    <td>${book.title}</td>
                                    <td>${book.author}</td>
                                    <td>${book.category}</td>
                                    <td>${book.dateAdded.toLocaleDateString()}</td>
                                    <td>${book.publisher}</td>
                                    <td>${book.stock}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </body>
            </html>
        `;

        const downloadDir = DownloadDirectoryPath;

        try {
            const timestamp = new Date().getTime(); // Get current timestamp
            const fileName = `Detail_Report_Books_${timestamp}`;
            const filePath = `${downloadDir}/${fileName}.pdf`;

            const fileExists = await exists(filePath);
            if (fileExists) {
                console.log('File already exists:', filePath);
                Alert.alert(
                    'PDF Downloaded Previously',
                    `PDF file already exists at ${filePath}`,
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
                return filePath;
            }

            const { filePath: newFilePath } = await RNHTMLtoPDF.convert({
                html: htmlContent,
                fileName,
                directory: downloadDir,
            });

            console.log('PDF generated:', newFilePath);
            return newFilePath;
        } catch (error) {
            console.error('Error generating or downloading PDF:', error);
            Alert.alert(
                'PDF Download Failed',
                `Failed to generate or download PDF file: ${error}`,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false }
            );
            return null;
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const filePath = await generatePDF();
            if (filePath) {
                console.log('PDF file path:', filePath);
                Alert.alert(
                    'PDF Downloaded Successfully',
                    `PDF file downloaded to ${filePath}`,
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
            } else {
                console.log('Failed to generate PDF');
            }
        } catch (error) {
            console.error('Error downloading PDF:', error);
            Alert.alert(
                'Error',
                `Failed to download PDF: ${error}`,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false }
            );
        }
    };

    const renderItem = ({ item }) => (
        <View style={styles.tableRow}>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.title}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.author}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.category}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.dateAdded.toLocaleDateString()}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.publisher}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.stock}</Text>
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
            <Text style={styles.title}>Detail Report Books</Text>

            <View style={styles.tableHeader}>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Title</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Author</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Category</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Date Added</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Publisher</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Stock</Text>
                </View>
            </View>
            <FlatList
                data={filteredBooks}
                renderItem={renderItem}
                keyExtractor={item => item.id}
            />
            <ButtonComponent styleText={styles.buttonText} title="Download PDF" onPress={handleDownloadPDF} />
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

export default DetailReportBook;
