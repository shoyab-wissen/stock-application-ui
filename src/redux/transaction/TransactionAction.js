import axios from "axios";
import { BASE_URL, DEPOSIT, WITHDRAW, TRANSFER, BALANCE, STATEMENT } from "../../utils/constants";
import * as types from "./TransactionTypes";
import { fetchUserData } from "../user/UserAction";

export const depositMoney = (accountNumber, amount) => async (dispatch) => {
    try {
        let data = {
            accountNumber,
            amount: parseFloat(amount)
        }
        
        const response = await axios.post(`${BASE_URL}${DEPOSIT}`, data);
        
        dispatch({
            type: types.DEPOSIT,
            payload: response.data
        });
        
        // Refresh user data after deposit
        await dispatch(fetchUserData(accountNumber));
        
        return response.data;
    } catch (error) {
        console.error('Deposit error:', error);
        throw error;
    }
};

export const withdrawMoney = (accountNumber, amount) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}${WITHDRAW}`, {
            accountNumber,
            amount: parseFloat(amount)
        });
        
        dispatch({
            type: types.WITHDRAW,
            payload: response.data
        });
        
        // Refresh user data after withdrawal
        await dispatch(fetchUserData(accountNumber));
        
        return response.data;
    } catch (error) {
        console.error('Withdrawal error:', error);
        throw error;
    }
};

export const transferMoney = (senderAccountNumber, receiverAccountNumber, amount) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}${TRANSFER}`, {
            senderAccountNumber,
            receiverAccountNumber,
            amount: parseFloat(amount)
        });
        
        dispatch({
            type: types.TRANSFER,
            payload: response.data
        });
        
        await dispatch(fetchUserData(senderAccountNumber));
        
        return response.data;
    } catch (error) {
        console.error('Transfer error:', error);
        throw error;
    }
};

export const getBalance = (accountNumber) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}${BALANCE}`, {
            accountNumber
        });
        
        // Dispatch balance update
        dispatch({
            type: types.GET_BALANCE,
            payload: response.data
        });

        // Also update recent transactions
        if (response.data.recentTransactions) {
            dispatch({
                type: types.GET_RECENT_TRANSACTIONS,
                payload: response.data.recentTransactions
            });
        }
        
        return response.data;
    } catch (error) {
        console.error('Balance inquiry error:', error);
        throw error;
    }
};

export const getStatement = (accountNumber, fromDate, toDate) => async (dispatch) => {
    try {
        const response = await axios.post(`${BASE_URL}${STATEMENT}`, {
            accountNumber,
            fromDate,
            toDate
        });
        
        dispatch({
            type: types.GET_STATEMENT,
            payload: response.data
        });
        
        return response.data;
    } catch (error) {
        console.error('Statement error:', error);
        throw error;
    }
};

export const getRecentTransactions = (accountNumber) => async (dispatch) => {
    try {
        const response = await axios.get(`${BASE_URL}/transaction/recent`, {
            params: { accountNumber }
        });
        
        dispatch({
            type: types.GET_RECENT_TRANSACTIONS,
            payload: response.data
        });
        
        return response.data;
    } catch (error) {
        console.error('Get transactions error:', error);
        throw error;
    }
};



