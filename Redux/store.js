import { legacy_createStore as createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';

import cartReducer from './Reducers/cartReducer';
import productReducer from './Reducers/productReducer';
import reviewReducer from './Reducers/reviewReducer';
import orderReducer from './Reducers/orderReducer';

const rootReducer = combineReducers({
    cart: cartReducer,
    products: productReducer,
    reviews: reviewReducer,
    orders: orderReducer
})

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

export default store;

