import { combineReducers, createStore } from 'redux';
import tokenReducer from './tokenReducer/tokenReducer'
import usersReducer from './usersReducer/usersReducer'

const reducer = combineReducers({
    token: tokenReducer,
    users: usersReducer
});

const store = createStore(reducer);
export default store;