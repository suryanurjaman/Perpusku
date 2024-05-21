const initialState = {
    userData: null
};

const ProfileReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SAVE_PROFILE_CHANGES':
            return {
                ...state,
                userData: {
                    ...state.userData,
                    ...action.payload.editedData
                }
            };
        default:
            return state;
    }
};

export default ProfileReducer;
