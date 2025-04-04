export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';
export const TOGGLE_SELECTION = 'TOGGLE_SELECTION';
export const CLEAR_CART = 'CLEAR_CART';
export const SET_SELECTED_ITEMS_FOR_CHECKOUT = 'SET_SELECTED_ITEMS_FOR_CHECKOUT';
export const FETCH_CART_ITEMS = 'FETCH_CART_ITEMS';
export const REMOVE_SELECTED_ITEMS = 'REMOVE_SELECTED_ITEMS';
import {
    getCartItems,
    removeCartItem,
    updateCartItemQuantity,
    toggleCartItemSelection,
} from '../../Helper/cartDB';

export const removeSelectedItems = () => ({
    type: REMOVE_SELECTED_ITEMS
});

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

export const fetchCartItems = (items) => ({
    type: FETCH_CART_ITEMS,
    payload: items
});

export const loadCartItems = (userId) => async (dispatch) => {
    try {
        const items = await getCartItems(userId);

        const formattedItems = items.map(item => ({
            id: item.id,
            name: item.name || item.product_name || 'Unknown Name',
            category: item.category || item.product_category || 'Unknown Category',
            price: item.price || item.product_price || 0,
            image: item.image || item.product_image || 'https://via.placeholder.com/150',
            quantity: item.quantity || 1,
            selected: Boolean(item.selected),
        }));

        dispatch(fetchCartItems(formattedItems));
    } catch (error) {
        console.error('Failed to fetch cart items:', error);
    }
};

export const updateCartQuantity = (userId, productId, quantity) => async (dispatch) => {
    try {
        const success = await updateCartItemQuantity(userId, productId, quantity);
        if (success) {
            dispatch(updateQuantity(productId, quantity));
        }
    } catch (error) {
        console.error('Error updating cart quantity:', error);
    }
};

export const removeCartProduct = (userId, productId) => async (dispatch) => {
    try {
        const success = await removeCartItem(userId, productId);
        if (success) {
            dispatch(removeFromCart(productId));
        }
    } catch (error) {
        console.error('Error removing item from cart:', error);
    }
};

export const toggleCartItem = (userId, productId, selected) => async (dispatch) => {
    try {
        const success = await toggleCartItemSelection(userId, productId, selected);
        if (success) {
            dispatch(toggleSelection(productId));
        }
    } catch (error) {
        console.error('Error toggling cart selection:', error);
    }
};

export const removeSelectedItemsFromCart = (userId) => async (dispatch, getState) => {
    try {
        const state = getState();
        const selectedItems = state.cart.cartItems.filter(item => item.selected);
        
        for (const item of selectedItems) {
            await removeCartItem(userId, item.id);
        }
        
        dispatch(removeSelectedItems());
    } catch (error) {
        console.error('Error removing selected items:', error);
    }
};