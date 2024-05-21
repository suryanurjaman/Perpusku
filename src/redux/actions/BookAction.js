import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { ADD_BOOK_SUCCESS, DELETE_BOOK_SUCCESS, FETCH_BOOKS_SUCCESS, ADD_BOOK_ERROR, DELETE_BOOK_ERROR, FETCH_BOOKS_ERROR, UPDATE_BOOK_SUCCESS, UPDATE_BOOK_ERROR } from './BookActionType'

// Action Creators
export const addBookSuccess = () => ({ type: ADD_BOOK_SUCCESS });
export const deleteBookSuccess = () => ({ type: DELETE_BOOK_SUCCESS });
export const fetchBooksSuccess = (books) => ({ type: FETCH_BOOKS_SUCCESS, payload: books });
export const addBookError = (error) => ({ type: ADD_BOOK_ERROR, payload: error });
export const deleteBookError = (error) => ({ type: DELETE_BOOK_ERROR, payload: error });
export const fetchBooksError = (error) => ({ type: FETCH_BOOKS_ERROR, payload: error });
export const updateBookSuccess = () => ({ type: UPDATE_BOOK_SUCCESS });
export const updateBookError = (error) => ({ type: UPDATE_BOOK_ERROR, payload: error });

// Async Actions
export const addBook = (bookData) => {
    return async (dispatch) => {
        try {
            await firestore().collection('books').add(bookData);
            dispatch(addBookSuccess());
        } catch (error) {
            dispatch(addBookError(error.message));
        }
    };
};

export const deleteBook = (bookId, imageUrl) => {
    return async (dispatch) => {
        try {
            // Hapus gambar dari penyimpanan Firestore jika ada
            if (imageUrl) {
                const imageRef = storage().refFromURL(imageUrl);
                await imageRef.delete();
            }

            // Hapus data buku dari koleksi Firestore
            await firestore().collection('books').doc(bookId).delete();

            dispatch(deleteBookSuccess());
        } catch (error) {
            dispatch(deleteBookError(error.message));
        }
    };
};

export const fetchBooks = () => {
    return async (dispatch) => {
        try {
            // Langganan perubahan data buku dari Firestore
            const unsubscribe = firestore().collection('books')
                .onSnapshot((snapshot) => {
                    if (snapshot) {
                        const books = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                            dateAdded: doc.data().dateAdded.toDate().getTime()
                        }));
                        dispatch(fetchBooksSuccess(books));
                    }
                });

            // Ingat untuk membatalkan langganan saat komponen unmount
            return () => unsubscribe();
        } catch (error) {
            console.error("An error occurred while fetching books:", error);
            dispatch(fetchBooksError(error.message));
        }
    };
};

export const updateBook = (updatedData, selectedImage, oldImageUrl) => {
    return async (dispatch) => {
        try {
            const { id, ...dataWithoutId } = updatedData; // Pisahkan id dari data
            await firestore().collection('books').doc(id).update(dataWithoutId); // Gunakan data tanpa id
            dispatch(updateBookSuccess());

            // Jika gambar baru dipilih, unggah gambar tersebut
            if (selectedImage !== oldImageUrl) {
                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                const fileName = `${updatedData.title.replace(/\s/g, '')}_${timestamp}`;
                const reference = storage().ref(`bookImages/${fileName}`);
                await reference.putFile(selectedImage);
                const imageUrl = await reference.getDownloadURL();

                // Hapus gambar lama dari penyimpanan jika ada
                console.log('data tua:', oldImageUrl)
                if (oldImageUrl) {
                    await storage().refFromURL(oldImageUrl).delete();
                }

                // Perbarui URL gambar di Firestore
                await firestore().collection('books').doc(updatedData.id).update({ imageUrl: imageUrl });

                console.log('URL gambar berhasil diperbarui');
            }
        } catch (error) {
            dispatch(updateBookError(error.message));
        }
    };
};
