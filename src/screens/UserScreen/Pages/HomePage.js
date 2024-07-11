import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AdminHeader from '../../../components/Headers/AdminHeader'
import SearchInputComponent from '../../../components/TextInput/SearchInputComponent'
import CategoryComponent from '../../../components/Category/CategoryComponent'
import { useDispatch, useSelector } from 'react-redux'
import auth from '@react-native-firebase/auth';
import { fetchUser } from '../../../redux/actions/AuthAction'
import { fetchBooks } from '../../../redux/actions/BookAction'
import ModalComponentUser from '../../../components/Modal/ModalComponentUser'
import BookCardComponentUser from '../../../components/BookCard/BookCardComponentUser'

const HomePage = ({ navigation }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const bookData = useSelector(state => state.book.bookItems);
    const categories = ['All', ...Array.from(new Set(bookData.map(book => book.category)))];
    const user = auth().currentUser;
    const dispatch = useDispatch()
    const [refreshing, setRefreshing] = React.useState(false);

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        if (user) {
            const userId = user.uid;
            dispatch(fetchUser(userId));
        }
        dispatch(fetchBooks())
            .then(() => {
                setTimeout(() => {
                    setRefreshing(false);
                }, 1000);
            })
            .catch(() => {
                setTimeout(() => {
                    setRefreshing(false);
                }, 1000);
            });
    }, [dispatch]);

    const userData = useSelector(state => state.auth.userData);
    console.log('Dataaa User:', userData)
    const [modalVisible, setModalVisible] = useState(false);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    useEffect(() => {
        if (user) {
            const userId = user.uid;
            dispatch(fetchUser(userId));
            dispatch(fetchBooks())
        }
    }, [dispatch])

    const onIcon2Press = () => {
        setModalVisible(true);
    }
    return (
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.container}>
                <AdminHeader
                    icon2='user'
                    tittle='Hi, User'
                    size={18}
                    onIcon2Press={onIcon2Press}
                />
                <SearchInputComponent
                    placeholder='Search...'
                    onChangeText={handleSearch}
                />
                <CategoryComponent categories={categories} onCategorySelect={handleCategorySelect} />
                <View>
                    <Text style={styles.textTitle}>Data Buku</Text>
                    <BookCardComponentUser
                        refreshing={refreshing}
                        selectedCategory={selectedCategory}
                        searchQuery={searchQuery}
                    />
                </View>
                <ModalComponentUser
                    dataValue={userData}
                    modalVisible={modalVisible}
                    hideModal={() => setModalVisible(false)}
                    title='Profile'
                    isProfile={true}
                />
            </View>
        </ScrollView>
    )
}

export default HomePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    textTitle: {
        fontWeight: 'bold',
        fontSize: 26,
        marginBottom: 12,
        marginLeft: 46,
    }
})