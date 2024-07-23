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
        case EXTEND_BORROW_DURATION:
            return {
                ...state,
                borrowedBooks: state.borrowedBooks.map((book) =>
                    book.id === action.payload.borrowedBookId
                        ? { ...book, returnDate: action.payload.newReturnDate }
                        : book
                ),
            };
        default:
            return state
    }
}

export default BorrowBookReducer;