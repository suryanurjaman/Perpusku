import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export const SaveProfileChanges = async (editedData, photoUri) => {
    return async dispatch => {
        try {
            const user = auth().currentUser;

            // Jika ada foto yang dipilih, unggah foto ke Firebase Storage
            let photoURL = editedData.photoURL;
            if (photoUri) {
                const storageRef = storage().ref(`profile_images/${user.uid}/${Date.now()}`);
                await storageRef.putFile(photoUri);
                photoURL = await storageRef.getDownloadURL();
            }

            // Perbarui data di Firebase Authentication
            await user.updateProfile({
                displayName: editedData.fullname,
                photoURL: photoURL
            });

            // Perbarui data di Firestore
            const userDocRef = firestore().collection('users').doc(user.uid);
            await userDocRef.update({
                fullname: editedData.fullname,
                photoURL: photoURL
            });

            // Dispatch aksi untuk memperbarui state Redux
            dispatch({
                type: 'SAVE_PROFILE_CHANGES',
                payload: {
                    editedData: { ...editedData, photoURL: photoURL }
                },
            });

            // Berikan umpan balik kepada pengguna bahwa perubahan berhasil disimpan
            Alert.alert('Success', 'Profile changes saved successfully.');
        } catch (error) {
            console.error('Error saving profile changes: ', error);
            // Handle error jika gagal menyimpan perubahan
            Alert.alert('Error', 'Failed to save profile changes.');
        }
    };
};
