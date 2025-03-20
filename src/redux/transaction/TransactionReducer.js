import * as types from "./TransactionTypes";

const initialState = {
    recentTransactions: [],
    lastTransaction: null,
    balance: 0,
    loading: false,
    error: null,
    status: null,
    message: null
};

const transactionReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.DEPOSIT:
        case types.WITHDRAW:
        case types.TRANSFER:
            return {
                ...state,
                lastTransaction: action.payload,
                recentTransactions: [action.payload, ...state.recentTransactions],
                loading: false,
                error: null
            };
        case types.GET_BALANCE:
            return {
                ...state,
                balance: action.payload.balance,
                status: action.payload.status,
                message: action.payload.message,
                loading: false,
                error: null
            };
        case types.GET_RECENT_TRANSACTIONS:
            return {
                ...state,
                recentTransactions: action.payload,
                loading: false,
                error: null
            };
        default:
            return state;
    }
};

export default transactionReducer;

