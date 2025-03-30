export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const TOGGLE_SELECTION = 'TOGGLE_SELECTION';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_SELECTED_ITEMS_FOR_CHECKOUT = 'SET_SELECTED_ITEMS_FOR_CHECKOUT';

export const addToCart = (item) => ({
    type: ADD_TO_CART,
    payload: item
});

export const removeFromCart = (id) => ({
    type: REMOVE_FROM_CART,
    payload: id
});

export const updateQuantity = (id, quantity) => ({
    type: UPDATE_QUANTITY,
    payload: { id, quantity }
});

export const toggleSelection = (id) => ({
    type: TOGGLE_SELECTION,
    payload: id
});

export const clearCart = () => ({
    type: CLEAR_CART
});

export const setSelectedItemsForCheckout = (items) => ({
    type: SET_SELECTED_ITEMS_FOR_CHECKOUT,
    payload: items
});
