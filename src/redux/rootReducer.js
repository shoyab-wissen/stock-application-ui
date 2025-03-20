import { combineReducers } from 'redux';
import userReducer from './user/UserReducer';
import transactionReducer from './transaction/TransactionReducer';

const rootReducer = combineReducers({
    user: userReducer,
    transaction: transactionReducer
});

export default rootReducer;
