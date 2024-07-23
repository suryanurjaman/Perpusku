// action.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';


export const autoLogin = () => {
    return async dispatch => {
        try {
            const userData = await AsyncStorage.getItem('userData');

            if (userData) {
                const parsedUserData = JSON.parse(userData);

                dispatch({
                    type: 'LOGIN',
                    payload: {
                        userData: parsedUserData,
                    },
                });
            }
        } catch (error) {
            console.error('Error auto logging in: ', error);
        }
    };
};

export const fetchUser = (userId) => {
    return async (dispatch) => {
        let unsubscribe;
        try {
            if (!userId) {
                console.error('User ID is required to initialize');
                return;
            }
            // Langganan perubahan pada dokumen pengguna di Firestore
            unsubscribe = firestore().collection('users').doc(userId)
                .onSnapshot((snapshot) => {
                    if (snapshot) {
                        const userData = snapshot.data();


                        dispatch({
                            type: 'LOGIN',
                            payload: {
                                userData: {
                                    ...userData,
                                    userId: userId // Menyertakan userId ke dalam userData
                                }
                            },
                        });
                    } else {
                        console.log("User document does not exist");
                        // Lakukan tindakan yang sesuai jika dokumen pengguna tidak ada
                    }
                });

            // Ingat untuk membatalkan langganan saat komponen unmount atau saat log out
            return () => {
                if (unsubscribe) {
                    unsubscribe();
                }
            };
        } catch (error) {
            console.error('Error initializing app: ', error);
        }
    };
};

export const Login = (email, password) => {
    return async dispatch => {
        try {
            const response = await auth().signInWithEmailAndPassword(email, password);
            const { user } = response;
            const userRef = firestore().collection('users').doc(user.uid);

            const userDoc = await userRef.get();

            if (userDoc.exists) {
                const userData = userDoc.data();

                await AsyncStorage.setItem('userData', JSON.stringify(userData));

                dispatch({
                    type: 'LOGIN',
                    payload: {
                        userData: {
                            ...userData,
                            userId: user.uid // Menyertakan userId ke dalam userData
                        }
                    },
                });

            } else {
                // Handle case when user document does not exist
                console.log("User document does not exist");
                Alert.alert('Error Login', 'Email atau password salah atau akun tidak ditemukan.');
            }
        } catch (error) {
            if (error.code === 'auth/invalid-credential') {
                console.log("User not found:", error.message);
                Alert.alert('Error Login', 'Akun tidak terdaftar.');
            } else {
                console.log("Terjadi kesalahan saat login:", error.message);
                Alert.alert('Error Login', 'Email atau password salah. Silakan coba lagi.');
            }
        }
    };
};


export const SignUp = (username, email, password, role, nip) => {
    return async dispatch => {
        try {
            const response = await auth().createUserWithEmailAndPassword(email, password);
            const { user } = response;
            await firestore().collection('users').doc(user.uid).set({
                username: username,
                email: email,
                role: role,
                nip: nip // Menyimpan NIP ke Firestore
            });
        } catch (error) {
            console.error('Error signing up: ', error);
            Alert.alert('Error Sign Up', 'Pastikan data telah terisi dengan benar dengan benar');
        }
    };
};

export const Logout = () => {
    return async dispatch => {
        try {
            await AsyncStorage.removeItem('userData');
            await auth().signOut();
            dispatch({
                type: 'LOGOUT',
            });
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };
};

export const EditProfile = (editedValue, selectedImage, oldImageUrl) => {
    return async (dispatch) => {
        try {
            const { id, ...dataWithoutId } = editedValue;
            await firestore().collection('users').doc(id).update(dataWithoutId);

            if (selectedImage && selectedImage !== oldImageUrl) {
                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                const fileName = `${editedValue.username.replace(/\s/g, '')}_${timestamp}`;
                const reference = storage().ref(`profileImages/${fileName}`);
                await reference.putFile(selectedImage);
                const imageUrlBaru = await reference.getDownloadURL();

                if (oldImageUrl) {
                    await storage().refFromURL(oldImageUrl).delete();
                }

                await firestore().collection('users').doc(id).update({ imageUrl: imageUrlBaru });
                console.log('URL gambar berhasil diperbarui');
            } else {
                console.log('Tidak ada gambar yang dipilih untuk diunggah.');
            }

            const updatedUserDoc = await firestore().collection('users').doc(id).get();
            const updatedUserData = updatedUserDoc.data();

            dispatch({
                type: 'EDIT_PROFILE',
                payload: { updatedUserData },
            });

        } catch (error) {
            console.error('Error saving profile changes: ', error);
            Alert.alert('Gagal menyimpan perubahan profil: ', error.message);
        }
    };
};


export const deleteUser = (dataValue, password, navigation) => {
    return async (dispatch) => {
        try {
            await AsyncStorage.removeItem('userData');
            // Mendapatkan email pengguna saat ini
            const email = auth().currentUser.email;

            // Membuat kredensial dengan email pengguna dan password yang dimasukkan
            const credential = auth.EmailAuthProvider.credential(email, password);

            // Reautentikasi pengguna dengan kredensial
            await auth().currentUser.reauthenticateWithCredential(credential);

            firestore().collection('users').doc(dataValue.userId).delete();
            console.log('data user di firestore telah di delete')

            if (dataValue.imageUrl) {
                storage().refFromURL(dataValue.imageUrl).delete();
                console.log('data image jika ada akan di hapus')
            }

            await auth().currentUser.delete()
            console.log('data user di authentication telah di delete')

            Alert.alert('Sukses', 'Pengguna berhasil dihapus');

            dispatch({ type: 'DELETE_USER' });
            navigation.replace('Login');
        } catch (error) {
            console.log("Error deleting user:", error);
            if (error.code === "auth/invalid-credential") {
                Alert.alert("Password yang dimasukkan salah.");
            } else {
                console.log("Terjadi kesalahan saat menghapus pengguna.");
            }
        }
    };
};