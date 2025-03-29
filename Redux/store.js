import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import cartReducer from './Reducers/cartReducer';
import productReducer from './Reducers/productReducer';

const rootReducer = combineReducers({
    cart: cartReducer,
    products: productReducer
})

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

export default store;

