import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const CategoryComponent = ({ categories, onCategorySelect }) => {
    const [activeTitle, setActiveTitle] = useState('All');
    const handleCategorySelect = (title) => {
        setActiveTitle(title);
        onCategorySelect(title); // Panggil fungsi onCategorySelect dengan kategori yang dipilih
    };
    return (
        <View style={styles.container}>
            <ScrollView style={{ marginHorizontal: 20 }} horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((title, index) => (
                    <TouchableOpacity key={title} onPress={() => handleCategorySelect(title)} style={styles.titleContainer}>
                        <Text style={[styles.text, activeTitle === title && styles.activeText]}>
                            {title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}

export default CategoryComponent

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginBottom: 36
    },
    titleContainer: {
        paddingHorizontal: 20
    },
    text: {
        marginRight: 20,
        fontWeight: '400',
        fontSize: 20,
        color: '#9D9D9D',
    },
    activeText: {
        color: '#333333',
    },
})