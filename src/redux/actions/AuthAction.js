// action.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const Init = () => {
    return async dispatch => {
        try {
            const role = await AsyncStorage.getItem('role');
            const userDataString = await AsyncStorage.getItem('userData'); // Tambahkan ini
            const userData = JSON.parse(userDataString); // Tambahkan ini
            if (role !== null && userData !== null) { // Periksa jika role dan userData tidak null
                dispatch({
                    type: 'LOGIN',
                    payload: {
                        role: role,
                        userData: userData
                    },
                });
            }
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

            // Langganan perubahan pada dokumen pengguna di Firestore
            userRef.onSnapshot((doc) => {
                if (doc) {
                    const userData = doc.data();
                    AsyncStorage.setItem('role', userData.role);
                    AsyncStorage.setItem('userData', JSON.stringify(userData));
                    dispatch({
                        type: 'LOGIN',
                        payload: {
                            role: userData.role,
                            userData: userData
                        },
                    });
                }
            });
        } catch (error) {
            Alert.alert('Invalid credentials or error occurred.');
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
            await auth().signOut();
            await AsyncStorage.clear();
            dispatch({
                type: 'LOGOUT',
            });
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };
};

export const EditProfile = (userId, editedValue, selectedImage, dataValue) => {
    return async (dispatch) => {
        try {
            if (selectedImage !== dataValue.imageUrl) {
                const currentUser = auth().currentUser;
                if (currentUser) {
                    await currentUser.updateProfile({
                        photoURL: selectedImage
                    });
                }

                if (dataValue.imageUrl) {
                    const oldImageRef = storage().refFromURL(dataValue.imageUrl);
                    await oldImageRef.delete();
                }

                const currentDate = new Date();
                const timestamp = currentDate.getTime();
                const fileName = `${updatedData.username.replace(/\s/g, '')}_${timestamp}`;
                const reference = storage().ref(`profileImages/${fileName}`);
                await reference.putFile(selectedImage);
                const imageUrl = await reference.getDownloadURL();

                await firestore().collection('users').doc(userId).update({ imageUrl: imageUrl });
            }

            await firestore().collection('users').doc(userId).update(editedValue);

            dispatch({
                type: 'SAVE_PROFILE_CHANGES',
                payload: { editedValue, imageUrl: selectedImage },
            });
        } catch (error) {
            console.error('Error saving profile changes: ', error);
            Alert.alert('Gagal menyimpan perubahan profil: ', error.message);
        }
    };
};

export const fetchUserData = (userId) => {
    return async (dispatch) => {
        try {
            const userDoc = await firestore().collection('users').doc(userId).get();

            if (userDoc.exists) {
                const userData = userDoc.data();
                dispatch({
                    type: 'FETCH_USER_DATA',
                    payload: userData,
                });
            } else {
                console.log("User document doesn't exist");
            }
        } catch (error) {
            console.error('Error fetching user data: ', error);
            Alert.alert('Gagal mengambil data pengguna: ', error.message);
        }
    };
};
