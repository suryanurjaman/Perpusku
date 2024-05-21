import { ADD_BOOK_SUCCESS, DELETE_BOOK_SUCCESS, FETCH_BOOKS_SUCCESS, ADD_BOOK_ERROR, DELETE_BOOK_ERROR, FETCH_BOOKS_ERROR, UPDATE_BOOK_SUCCESS, UPDATE_BOOK_ERROR } from '../actions/BookActionType';

const initialState = {
    bookItems: [],
    error: null
};

const BooksReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_BOOK_SUCCESS:
        case DELETE_BOOK_SUCCESS:
            const updatedBooks = state.bookItems.filter(book => book.id !== action.payload);
            return { ...state, bookItems: updatedBooks, error: null };
        case UPDATE_BOOK_SUCCESS:
            return { ...state, error: null };
        case ADD_BOOK_ERROR:
        case DELETE_BOOK_ERROR:
        case FETCH_BOOKS_ERROR:
        case UPDATE_BOOK_ERROR:
            return { ...state, error: action.payload };
        case FETCH_BOOKS_SUCCESS:
            return { ...state, bookItems: action.payload, error: null };
        default:
            return state;
    }
};

export default BooksReducer;
