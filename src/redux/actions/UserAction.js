import { ADD_USER, DELETE_USER, UPDATE_USER, SET_USERS } from './UserActionType';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

export const addUser = (userData) => {
    return async (dispatch) => {
        try {
            // Tambahkan pengguna ke Firebase Authentication
            const { email, password, imageUrl, ...otherData } = userData;
            const authUser = await auth().createUserWithEmailAndPassword(email, password);
            const userId = authUser.user.uid;

            // Upload gambar ke Firebase Storage jika imageUrl bukan URL storage
            let imageUrlInStorage = imageUrl; // URL storage defaultnya adalah URL firebase
            if (!imageUrl.includes('firebase')) {
                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                const fileName = `${userId}_${timestamp}`;
                const reference = storage().ref(`profileImages/${fileName}`);
                await reference.putFile(imageUrl); // Upload gambar
                imageUrlInStorage = await reference.getDownloadURL(); // Dapatkan URL download gambar yang diupload
            }

            // Tambahkan data pengguna ke Firestore
            await firestore().collection('users').doc(userId).set({
                ...otherData,
                imageUrl: imageUrlInStorage,
            });

            const userPayload = {
                id: userId, // Gunakan userId dari Firebase Authentication sebagai ID pengguna
                ...userData,
            };

            dispatch({
                type: ADD_USER,
                payload: userPayload,
            });
        } catch (error) {
            console.error(error);
        }
    };
};


export const deleteUser = (userId) => {
    return async (dispatch) => {
        try {
            await firestore().collection('users').doc(userId).delete();
            dispatch({
                type: DELETE_USER,
                payload: userId,
            });
        } catch (error) {
            console.error(error);
        }
    };
};

export const updateUser = (updatedData, selectedImage, oldImageUrl) => {
    return async (dispatch) => {
        try {
            const { id, ...dataWithoutId } = updatedData;

            // Hapus imageUrl dari dataWithoutId jika tidak ada gambar yang dipilih
            if (!selectedImage) {
                delete dataWithoutId.imageUrl;
            }

            // Jika gambar baru dipilih dan berbeda dengan gambar lama
            if (selectedImage) {
                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                const fileName = `${updatedData.username.replace(/\s/g, '')}_${timestamp}`;
                const reference = storage().ref(`profileImages/${fileName}`);
                await reference.putFile(selectedImage);
                const imageUrl = await reference.getDownloadURL();

                // Hapus gambar lama dari penyimpanan jika ada
                console.log('old image :', oldImageUrl)
                if (oldImageUrl) {
                    await storage().refFromURL(oldImageUrl).delete();
                }

                // Perbarui URL gambar di Firestore
                await firestore().collection('users').doc(updatedData.id).update({ imageUrl: imageUrl });

                console.log('URL gambar berhasil diperbarui');
            } else {
                // Jika tidak ada gambar yang dipilih atau gambar sama dengan gambar lama
                console.log('Tidak ada gambar yang dipilih atau gambar sama dengan gambar lama');
            }

            // Perbarui data pengguna di Firestore jika ada perubahan selain gambar
            await firestore().collection('users').doc(id).update(dataWithoutId);
            dispatch({
                type: UPDATE_USER,
                payload: dataWithoutId,
            });
        } catch (error) {
            console.error(error);
        }
    };
};

export const fetchUsers = () => {
    return async (dispatch) => {
        try {
            // Langganan perubahan data buku dari Firestore
            const unsubscribe = firestore().collection('users')
                .onSnapshot((snapshot) => {
                    if (snapshot) {
                        const users = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        dispatch({
                            type: SET_USERS,
                            payload: users,
                        });
                    }
                });

            // Ingat untuk membatalkan langganan saat komponen unmount
            return () => unsubscribe();
        } catch (error) {
            console.error(error);
        }
    };
};
