import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import { DownloadDirectoryPath, exists } from 'react-native-fs';
import ButtonComponent from '../../../../components/Button/ButtonComponent';

const DetailReportUser = () => {
    const [usersData, setUsersData] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRef = firestore().collection('users');
                const snapshot = await usersRef.get();
                const usersData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setUsersData(usersData);
                setFilteredUsers(usersData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

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
                        img {
                            max-width: 50px;
                            height: auto;
                        }
                    </style>
                </head>
                <body>
                    <h1 style="text-align: center;">Detail Report Users</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Image</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${filteredUsers.map(user => `
                                <tr>
                                    <td>${user.username}</td>
                                    <td>${user.email}</td>
                                    <td>${user.role}</td>
                                    <td>${user.imageUrl ? `<img src="${user.imageUrl}" alt="User Image" />` : 'No Image Available'}</td>
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
            const fileName = `Detail_Report_Users_${timestamp}`;
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
                <Text style={styles.cellText}>{item.username}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.email}</Text>
            </View>
            <View style={styles.cell}>
                <Text style={styles.cellText}>{item.role}</Text>
            </View>
            <View style={styles.cell}>
                {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.userImage} />
                ) : (
                    <Text style={styles.cellText}>No Image Available</Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detail Report Users</Text>

            <View style={styles.tableHeader}>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Username</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Email</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Role</Text>
                </View>
                <View style={styles.headerCell}>
                    <Text style={styles.headerText}>Image</Text>
                </View>
            </View>
            <FlatList
                data={filteredUsers}
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
    userImage: {
        width: 50,
        height: 50,
    },
    buttonText: {
        marginVertical: 16,
    },
});

export default DetailReportUser;
