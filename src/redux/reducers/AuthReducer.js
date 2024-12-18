// authReducer.js
const initialState = {
    role: null,
    isAuthenticated: false,
    userData: null
};

const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN':
        case 'SIGNUP':
            return {
                ...state,
                role: action.payload.role,
                isAuthenticated: true,
                userData: action.payload.userData
            };
        case 'LOGOUT':
            return {
                ...state,
                role: null,
                isAuthenticated: false,
                userData: null
            };
        case 'EDIT_PROFILE':
            return {
                ...state,
                userData: {
                    ...state.userData,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
};

export default AuthReducer;