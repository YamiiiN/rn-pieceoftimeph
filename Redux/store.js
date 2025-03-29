import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import cartReducer from './Reducers/cartReducer';
const rootReducer = combineReducers({
    cart: cartReducer
})

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

export default store;


