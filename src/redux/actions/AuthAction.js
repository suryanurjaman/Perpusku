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
                console.log("User document does not exist");
                Alert.alert('User document does not exist.');
            }
        } catch (error) {
            let errorMessage = 'An error occurred.';
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format.';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'User account has been disabled.';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No user found with this email.';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password.';
                    break;
                default:
                    errorMessage = error.message;
                    break;
            }
            Alert.alert(errorMessage);
            console.error('Login error:', error);
        }
    };
};


export const SignUp = (username, email, password, role) => {
    return async dispatch => {
        try {
            const response = await auth().createUserWithEmailAndPassword(email, password);
            const { user } = response;
            await firestore().collection('users').doc(user.uid).set({
                username: username,
                email: email,
                role: role
            });
        } catch (error) {
            console.error('Error signing up: ', error);
            Alert.alert('Error signing up: ', error.message);
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

            if (selectedImage !== oldImageUrl) {
                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                const fileName = `${editedValue.username.replace(/\s/g, '')}_${timestamp}`;
                const reference = storage().ref(`profileImages/${fileName}`);
                await reference.putFile(selectedImage);
                const imageUrlBaru = await reference.getDownloadURL();

                console.log('data tua:', oldImageUrl)
                if (oldImageUrl) {
                    await storage().refFromURL(oldImageUrl).delete();
                }

                await firestore().collection('users').doc(editedValue.id).update({ imageUrl: imageUrlBaru });
                console.log('URL gambar berhasil diperbarui');
            }

            const updatedUserDoc = await firestore().collection('users').doc(id).get();
            const updatedUserData = updatedUserDoc.data();

            console.log('result redux editing :', updatedUserData)

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

export const deleteUser = (dataValue, password) => {
    return async (dispatch) => {
        try {
            // Mendapatkan email pengguna saat ini
            const email = auth().currentUser.email;

            // Membuat kredensial dengan email pengguna dan password yang dimasukkan
            const credential = auth.EmailAuthProvider.credential(email, password);

            // Reautentikasi pengguna dengan kredensial
            await auth().currentUser.reauthenticateWithCredential(credential);

            firestore().collection('users').doc(dataValue.userId).delete();
            console.log('data user di firestore telah di delete')

            console.log('data image jika ada akan di hapus')
            if (dataValue.imageUrl) {
                storage().refFromURL(dataValue.imageUrl).delete();
            }

            await auth().currentUser.delete()
            console.log('data user di authentication telah di delete')


            Alert.alert('Sukses', 'Pengguna berhasil dihapus');

            dispatch({ type: 'DELETE_USER' });
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