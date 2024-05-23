import { ADD_USER, DELETE_USER, UPDATE_USER, SET_USERS } from './UserActionType';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

export const addUser = (userData) => {
    return async (dispatch) => {
        try {
            // Tambahkan pengguna ke Firebase Authentication
            const { email, password, imageUrl, ...otherData } = userData;
            const response = await auth().createUserWithEmailAndPassword(email, password);
            const { user } = response;

            const dataWithoutImage = {
                ...otherData,
                email: email,
            };

            await firestore().collection('users').doc(user.uid).set(dataWithoutImage);

            if (imageUrl) {
                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                const fileName = `${otherData.username}_${timestamp}`;
                const reference = storage().ref(`profileImages/${fileName}`);
                await reference.putFile(imageUrl); // Upload gambar
                const imageUrlInStorage = await reference.getDownloadURL(); // Dapatkan URL download gambar yang diupload

                await firestore().collection('users').doc(user.uid).update({
                    imageUrl: imageUrlInStorage
                });
            }

            const newUserDoc = await firestore().collection('users').doc(user.uid).get();

            console.log('data baru yang berhasil di input :', newUserDoc)

        } catch (error) {
            console.error(error);
        }
    };
};

export const updateUser = (updatedData, selectedImage, oldImageUrl) => {
    return async (dispatch) => {
        try {
            const { id, ...dataWithoutId } = updatedData;
            await firestore().collection('users').doc(id).update(dataWithoutId);

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

        } catch (error) {
            console.error(error);
        }
    };
};

export const fetchUsers = (userId) => {
    return async (dispatch) => {
        let unsubscribe;
        try {
            if (!userId) {
                console.error('User ID is required to initialize');
                return;
            }
            // Langganan perubahan data buku dari Firestore
            unsubscribe = firestore().collection('users')
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
                    } else {
                        console.log("User document does not exist")
                    }
                });

            // Ingat untuk membatalkan langganan saat komponen unmount
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        } catch (error) {
            console.error(error);
        }
    };
};
