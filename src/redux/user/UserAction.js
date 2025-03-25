import axios from "axios";
import { BASE_URL, LOGIN, REGISTER, GETUSER } from "../../utils/constants";
import { login, logout, register } from "./UserTypes";

export const loginUser = (accountNumber, password) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}${LOGIN}`, {
            accountNumber,
            password
        });
        
        if (response.data) {
            dispatch({
                type: login,
                payload: response.data
            });
            
            return response.data;
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const logoutUser = () => async (dispatch) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.email) {
            await axios.post(`${BASE_URL}/api/auth/logout`, null, {
                params: { email: user.email }
            });
        }
        localStorage.removeItem('user');
        dispatch({ type: logout });
    } catch (error) {
        console.error('Logout error:', error);
        // Still dispatch logout even if the server call fails
        dispatch({ type: logout });
    }
};

export const registerUser = (name, email, dob, password) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}${REGISTER}`, {
            name,
            email,
            dob,
            password
        });

        if (response.data) {
            dispatch({
                type: register,
                payload: response.data
            });
            
            return response.data;
        } else {
            throw new Error('Invalid response from server');
        }
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export const fetchUserData = (accountNumber) => async (dispatch) => {
    try {
        const response = await axios.get(`${BASE_URL}${GETUSER}/${accountNumber}`);
        
        if (response.data) {
            dispatch({
                type: login,
                payload: response.data
            });
            return response.data;
        }
    } catch (error) {
        console.error('Fetch user error:', error);
        throw error;
    }
};


export const verifyUserForReset = (username, dob) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}${VERIFY_USER}`, { username, dob });

        if (response.data.success) {
            dispatch({
                type: VERIFY_USER_FOR_RESET,
                payload: { username }
            });
            return { success: true };
        } else {
            return { success: false, message: 'User verification failed' };
        }
    } catch (error) {
        console.error('Verification error:', error);
        return { success: false, message: 'Error verifying user' };
    }
};


export const resetPassword = (username, newPassword) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}${RESET_PASSWORD}`, { username, newPassword });

        if (response.data.success) {
            dispatch({
                type: RESET_USER_PASSWORD
            });
            return { success: true };
        } else {
            return { success: false, message: 'Password reset failed' };
        }
    } catch (error) {
        console.error('Password reset error:', error);
        return { success: false, message: 'Error resetting password' };
    }
};
