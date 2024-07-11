import { BORROW_BOOK, FETCH_ALL_BORROW_BOOK, FETCH_BORROW_BOOK_BY_ID } from "./BorrowBookActionType";
import firestore from '@react-native-firebase/firestore'
import auth from '@react-native-firebase/auth'
import { Alert } from "react-native";

export const borrowBook = (bookId, borrowDuration) => {
    return async (dispatch) => {
        try {
            const userId = auth().currentUser?.uid;

            if (!userId) {
                throw new Error('User belum login');
            }

            const bookRef = firestore().collection('books').doc(bookId);
            const bookDoc = await bookRef.get();
            const bookData = bookDoc.data();

            if (!bookData) {
                throw new Error('Buku tidak ditemukan');
            }

            if (bookData.stock <= 0) {
                Alert.alert('Stok buku habis');
                return;
            }

            const borrowedAt = new Date(); // Mendapatkan tanggal saat ini
            const returnDate = new Date(borrowedAt); // Menyalin tanggal saat ini
            returnDate.setDate(returnDate.getDate() + 2); // Menambahkan jumlah hari peminjaman

            const borrowedAtFormatted = borrowedAt.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
            const returnDateFormatted = returnDate.toLocaleString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });

            await firestore().runTransaction(async (transaction) => {
                await firestore().collection('borrowed_books').add({
                    userId: userId,
                    bookId: bookId,
                    borrowedAt: borrowedAtFormatted,
                    returnDate: returnDateFormatted,
                    returned: false,
                    requestBorrow: false
                });

                const updatedStock = bookData.stock - 1;
                transaction.update(bookRef, { stock: updatedStock });

                console.log('Data berhasil dimasukkan ke Firestore:', {
                    userId: userId,
                    bookId: bookId,
                    borrowedAt: borrowedAt,
                    returnDate: returnDate,
                    returned: false
                });
            });
        } catch (error) {
            console.log(error);
            // Handle error message
        }
    };
};

export const requestBorrowBook = (bookId, borrowDuration) => {
    return async (dispatch) => {
        try {
            const userId = auth().currentUser?.uid;

            if (!userId) {
                throw new Error('User belum login');
            }

            // Cek apakah pengguna sudah meminjam buku yang sama sebelumnya dan peminjamannya masih ongoing
            const borrowedBooksRef = firestore().collection('borrowed_books');
            const querySnapshot = await borrowedBooksRef
                .where('userId', '==', userId)
                .where('bookId', '==', bookId)
                .where('ongoing', '==', true)
                .get();

            if (!querySnapshot.empty) {
                // Jika ada peminjaman sebelumnya dengan buku yang sama dan masih ongoing, beri alert
                Alert.alert('Anda sudah meminjam buku ini sebelumnya dan peminjaman masih berlangsung');
                return;
            }

            // Cek apakah pengguna sudah mencapai batas maksimum peminjaman
            const maxBorrowedBooks = 3; // Tentukan jumlah maksimum peminjaman
            const userBorrowedBooksRef = firestore().collection('borrowed_books').where('userId', '==', userId).where('ongoing', '==', true);
            const userBorrowedBooksSnapshot = await userBorrowedBooksRef.get();
            if (userBorrowedBooksSnapshot.size >= maxBorrowedBooks) {
                // Jika pengguna sudah mencapai batas maksimum peminjaman, beri alert
                Alert.alert('Anda sudah mencapai batas maksimum peminjaman');
                return;
            }

            // Lanjutkan dengan proses peminjaman jika pengguna belum meminjam buku yang sama atau belum mencapai batas maksimum peminjaman
            const bookRef = firestore().collection('books').doc(bookId);
            const bookDoc = await bookRef.get();
            const bookData = bookDoc.data();

            if (!bookData) {
                throw new Error('Buku tidak ditemukan');
            }

            if (bookData.stock <= 0) {
                Alert.alert('Stok buku habis');
                return;
            }

            await firestore().runTransaction(async (transaction) => {
                await firestore().collection('borrowed_books').add({
                    userId: userId,
                    bookId: bookId,
                    borrowDuration: 2,
                    approved: false,
                    ongoing: true
                });

                const updatedStock = bookData.stock - 1;
                transaction.update(bookRef, { stock: updatedStock });
            });

            // Get the data of the newly added document from borrowed_books collection
            const newBorrowedBookRef = firestore().collection('borrowed_books');
            const newBorrowedBookSnapshot = await newBorrowedBookRef.where('bookId', '==', bookId).where('userId', '==', userId).get();
            newBorrowedBookSnapshot.forEach((doc) => {
                console.log('Data yang ditambahkan:', doc.data());
            });
            Alert.alert('Sukses', 'Buku berhasil dipinjam, Silahkan tunggu approve dari admin');
        } catch (error) {
            console.log(error);
            Alert.alert('Error', error.message);
            // Handle error message
        }
    };
};




export const requestReturnBook = (borrowedBookId) => {
    return async (dispatch) => {
        try {
            const borrowedBookRef = firestore().collection('borrowed_books').doc(borrowedBookId);

            const borrowedBookDoc = await borrowedBookRef.get();

            if (!borrowedBookDoc.exists) {
                console.log('Data peminjaman tidak ditemukan');
                return;
            }

            const borrowedBookData = borrowedBookDoc.data();

            if (borrowedBookData.returned === false) {
                Alert.alert('Pengembalian sudah diajukan sebelumnya');
                return;
            }

            await borrowedBookRef.update({ returned: false });

        } catch (error) {
            console.log(error);
        }
    };
};

export const approveReturnRequest = (requestId) => {
    return async (dispatch) => {
        try {
            const requestRef = firestore().collection('borrowed_books').doc(requestId);

            const requestDoc = await requestRef.get();
            if (!requestDoc.exists) {
                throw new Error('Data peminjaman tidak ditemukan');
            }

            const requestData = requestDoc.data();
            if (requestData.returned) {
                Alert.alert('Buku Telah Dikembalikan');
                return;
            }

            // Pastikan returnDate ada dan valid
            if (!requestData.returnDate) {
                throw new Error('Tanggal pengembalian tidak ditemukan atau tidak valid');
            }

            // Mengubah tanggal pengembalian yang diharapkan ke dalam objek Date
            // Format tanggal: "6/7/2024 14.17"
            const [datePart, timePart] = requestData.returnDate.split(' ');
            const [day, month, year] = datePart.split('/');
            const [hour, minute] = timePart.split('.');

            // Buat objek Date dari bagian tanggal dan waktu
            const expectedReturnDate = new Date(year, month - 1, day, hour, minute);

            // Pastikan expectedReturnDate valid
            if (isNaN(expectedReturnDate.getTime())) {
                throw new Error('Format tanggal pengembalian tidak valid');
            }

            // Mendapatkan tanggal sekarang
            const currentDate = new Date();

            // Menghitung selisih hari terlambat
            const diffInDays = Math.floor((currentDate - expectedReturnDate) / (1000 * 60 * 60 * 24));

            // Jika diffInDays negatif, artinya buku dikembalikan lebih awal atau tepat waktu, jadi denda 0
            const fineAmount = diffInDays > 0 ? diffInDays * 5000 : 0;

            // Mengubah status menjadi disetujui dan menambahkan tanggal pengembalian aktual
            await requestRef.update({
                fine: fineAmount,
                actualReturnDate: currentDate.toLocaleString('id-ID', {
                    year: 'numeric',
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false,
                    timeZone: 'Asia/Jakarta'
                }),
                ongoing: false,
                returned: true
            });

            // Mengembalikan stok buku dengan menambah 1
            const bookRef = firestore().collection('books').doc(requestData.bookId);
            await firestore().runTransaction(async (transaction) => {
                const bookDoc = await transaction.get(bookRef);
                if (!bookDoc.exists) {
                    throw new Error('Buku tidak ditemukan');
                }

                const bookData = bookDoc.data();
                const updatedStock = bookData.stock + 1;
                transaction.update(bookRef, { stock: updatedStock });
            });

            console.log('Pengembalian buku berhasil diproses');

            // Optional: Load updated data and dispatch action to update state
            // Example:
            dispatch(fetchBorrowedBookByUserLogin(requestData.userId));
        } catch (error) {
            console.log('Error approving return request:', error);
            // Handle error message
        }
    };
};



export const fetchBorrowedBookByUserLogin = (userId) => {
    return async (dispatch) => {
        try {
            const borrowedBooksRef = firestore().collection('borrowed_books');
            const query = borrowedBooksRef.where('userId', '==', userId);
            const snapshot = await query.get();

            const borrowedBooks = [];
            for (const doc of snapshot.docs) {
                const borrowedBookData = doc.data();
                const bookId = borrowedBookData.bookId;
                const userId = borrowedBookData.userId;
                const borrowedBookId = doc.id;

                const bookRef = firestore().collection('books').doc(bookId);
                const userRef = firestore().collection('users').doc(userId);
                const bookDoc = await bookRef.get();
                const bookData = bookDoc.data();
                const userDoc = await userRef.get();
                const userData = userDoc.data();

                const borrowedBook = {
                    id: borrowedBookId,
                    username: userData.username,
                    bookId: bookId,
                    title: bookData.title,
                    author: bookData.author,
                    imageUrl: bookData.imageUrl,
                    returnDate: borrowedBookData.returnDate,
                    borrowDuration: borrowedBookData.borrowDuration,
                    status: borrowedBookData.approved,
                    ongoing: borrowedBookData.ongoing
                };

                borrowedBooks.push(borrowedBook);

                // Console log the data for each book
                console.log('Borrowed Book:', borrowedBook);
            }

            // Optional: Dispatch an action to store the fetched data in Redux
            dispatch({
                type: FETCH_BORROW_BOOK_BY_ID,
                payload: borrowedBooks
            });

        } catch (error) {
            console.error('Error getting borrowed books:', error);
        }
    }
}


export const fetchRequestBorrowData = () => {
    return async (dispatch) => {
        try {
            // Periksa apakah ada pengguna yang login
            const currentUser = auth().currentUser;
            if (!currentUser) {
                console.log('Tidak ada pengguna yang login. Tidak dapat mengambil data peminjaman.');
                return;
            }

            const borrowedBooksRef = firestore().collection('borrowed_books');

            // Langganan perubahan data peminjaman dari Firestore
            const unsubscribe = borrowedBooksRef.onSnapshot(async (snapshot) => {
                if (snapshot) {
                    const allRequestsData = [];

                    for (const doc of snapshot.docs) {
                        const requestId = doc.id;
                        const requestData = doc.data();
                        const { userId, bookId } = requestData;

                        try {
                            const userDoc = await firestore().collection('users').doc(userId).get();
                            const userData = userDoc.data();
                            if (!userData) {
                                throw new Error('Data pengguna tidak ditemukan');
                            }

                            const bookDoc = await firestore().collection('books').doc(bookId).get();
                            const bookData = bookDoc.data();
                            if (!bookData) {
                                throw new Error('Data buku tidak ditemukan');
                            }

                            // Convert dateAdded to string directly
                            const dateAddedString = bookData.dateAdded.toDate().toDateString();

                            // Include dateAdded as a string in bookData
                            const bookDataWithStringDateAdded = { ...bookData, dateAdded: dateAddedString };

                            const requestDataWithUserAndBook = {
                                id: requestId,
                                request: requestData,
                                user: userData,
                                book: bookDataWithStringDateAdded
                            };

                            allRequestsData.push(requestDataWithUserAndBook);
                        } catch (error) {
                            console.log(error);
                            // Handle error message
                        }
                    }

                    dispatch({
                        type: FETCH_ALL_BORROW_BOOK,
                        payload: allRequestsData
                    });
                }
            });

            // Ingat untuk membatalkan langganan saat komponen unmount
            return () => unsubscribe();
        } catch (error) {
            console.log(error);
            // Handle error message
        }
    };
};

export const approveBorrowRequest = (requestId, borrowDuration) => {
    return async (dispatch) => {
        try {
            const requestRef = firestore().collection('borrowed_books').doc(requestId);

            const requestDoc = await requestRef.get();
            if (!requestDoc.exists) {
                throw new Error('Data peminjaman tidak ditemukan');
            }

            const requestData = requestDoc.data();
            if (requestData.aproved) {
                console.log('Peminjaman telah disetujui sebelumnya');
                return;
            }

            const currentDate = new Date();
            const returnDate = new Date(currentDate.getTime() + borrowDuration * 24 * 60 * 60 * 1000); // Menambahkan jumlah hari ke tanggal sekarang
            const options = {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Jakarta'
            };
            const returnDateString = returnDate.toLocaleString('id-ID', options);

            await requestRef.update({
                'approved': true,
                'returnDate': returnDateString
            });

            console.log('Peminjaman berhasil disetujui dan tanggal pengembalian ditambahkan');

            // Optional: Load updated data and dispatch action to update state
            // Example:
            dispatch(fetchRequestBorrowData());
        } catch (error) {
            console.log('Error approving borrow request:', error);
            // Handle error message
        }
    };
};


