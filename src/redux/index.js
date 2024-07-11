import { configureStore } from "@reduxjs/toolkit";
import AuthReducer from "./reducers/AuthReducer";
import BooksReducer from "./reducers/BookReducer";
import userReducer from "./reducers/UserReducer";
import BorrowBookReducer from "./reducers/BorrowBookReducer";


export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        book: BooksReducer,
        user: userReducer,
        borrowBook: BorrowBookReducer
    }
})