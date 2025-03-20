import { initialUserState } from "../../models/User";
import { login, logout, register, VERIFY_USER_FOR_RESET, RESET_USER_PASSWORD } from "./UserTypes";

const userReducer = (state = initialUserState, action) => {
    switch (action.type) {
        case login:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            };
        
        case logout:
            return initialUserState;

        case register:
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            };
        
        
        case VERIFY_USER_FOR_RESET:
            return {
                ...state,
                resetUsername: action.payload.username
            };
        
        
        case RESET_USER_PASSWORD:
            return {
                ...state,
                resetUsername: null
            };
        
        default:
            return state;
    }
};

export default userReducer;
