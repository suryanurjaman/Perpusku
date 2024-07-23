import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';

const ReturnConfirmationModal = ({ visible, onClose, onConfirm }) => {
    const [damageOpen, setDamageOpen] = useState(false);
    const [damageValue, setDamageValue] = useState(null);
    const [damageItems, setDamageItems] = useState([
        { label: 'Tidak ada kerusakan', value: 'Tidak ada kerusakan' },
        { label: 'Ringan', value: 'Ringan' },
        { label: 'Berat', value: 'Berat' }
    ]);

    const [lossOpen, setLossOpen] = useState(false);
    const [lossValue, setLossValue] = useState(null);
    const [lossItems, setLossItems] = useState([
        { label: 'Tidak hilang', value: 'Tidak hilang' },
        { label: 'Hilang', value: 'Hilang' }
    ]);

    // Effect to close one dropdown when the other is opened
    useEffect(() => {
        if (damageOpen && lossOpen) {
            setLossOpen(false);
        }
    }, [damageOpen]);

    useEffect(() => {
        if (lossOpen && damageOpen) {
            setDamageOpen(false);
        }
    }, [lossOpen]);

    const handleConfirm = () => {
        onConfirm(damageValue, lossValue);
        onClose();
    };

    return (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>Konfirmasi Pengembalian Buku</Text>
                    <Text style={styles.label}>Kerusakan Buku:</Text>
                    <DropDownPicker
                        open={damageOpen}
                        value={damageValue}
                        items={damageItems}
                        setOpen={setDamageOpen}
                        setValue={setDamageValue}
                        setItems={setDamageItems}
                        style={styles.picker}
                        zIndex={100}
                        placeholder="Pilih kerusakan"
                    />
                    <Text style={styles.label}>Kehilangan Buku:</Text>
                    <DropDownPicker
                        open={lossOpen}
                        value={lossValue}
                        items={lossItems}
                        setOpen={setLossOpen}
                        setValue={setLossValue}
                        setItems={setLossItems}
                        style={styles.picker}
                        zIndex={80}
                        placeholder="Pilih kehilangan"
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={onClose} style={[styles.button, styles.cancelButton]}>
                            <Text style={styles.buttonText}>Batal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleConfirm} style={styles.button}>
                            <Text style={styles.buttonText}>Konfirmasi</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ReturnConfirmationModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    picker: {
        width: '100%',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: 'tomato',
    },
    cancelButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: 'white',
    },
});
