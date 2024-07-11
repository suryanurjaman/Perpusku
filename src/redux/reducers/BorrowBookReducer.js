import { BORROW_BOOK, FETCH_BORROW_BOOK_BY_ID, FETCH_ALL_BORROW_BOOK } from "../actions/BorrowBookActionType";

const initialState = {
    borrowedBook: [],
    allBorrowedBook: [],
}

const BorrowBookReducer = (state = initialState, action) => {
    switch (action.type) {
        case BORROW_BOOK:
            return {
                ...state,
                borrowedBook: action.payload
            }
        case FETCH_ALL_BORROW_BOOK:
            return {
                ...state,
                allBorrowedBook: action.payload
            }
        case FETCH_BORROW_BOOK_BY_ID:
            return {
                ...state,
                borrowedBook: action.payload
            }
        default:
            return state
    }
}

export default BorrowBookReducer;