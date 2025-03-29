import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_QUANTITY,
    TOGGLE_SELECTION,
    CLEAR_CART
} from '../Actions/cartActions';

const initialState = {
    cartItems: [],
    cartCount: 0,
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const existingItemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);

            if (existingItemIndex !== -1) {
                const updatedCartItems = [...state.cartItems];
                updatedCartItems[existingItemIndex] = {
                    ...updatedCartItems[existingItemIndex],
                    quantity: updatedCartItems[existingItemIndex].quantity + action.payload.quantity,
                };

                return {
                    ...state,
                    cartItems: updatedCartItems,
                    cartCount: state.cartCount + action.payload.quantity,
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, { ...action.payload, quantity: action.payload.quantity, selected: true }],
                    cartCount: state.cartCount + action.payload.quantity,
                };
            }


        case REMOVE_FROM_CART:
            const removedItem = state.cartItems.find(item => item.id === action.payload);
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload),
                cartCount: removedItem ? state.cartCount - removedItem.quantity : state.cartCount
            };

        case UPDATE_QUANTITY:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload.id
                        ? { ...item, quantity: Math.max(1, action.payload.quantity) }
                        : item
                ),
                cartCount: state.cartItems.reduce((total, item) =>
                    item.id === action.payload.id
                        ? total + action.payload.quantity
                        : total + item.quantity, 0
                ),
            };

        case TOGGLE_SELECTION:
            return {
                ...state,
                cartItems: state.cartItems.map(item =>
                    item.id === action.payload
                        ? { ...item, selected: !item.selected }
                        : item
                )
            };

        case CLEAR_CART:
            return {
                ...state,
                cartItems: [],
                cartCount: 0
            };

        default:
            return state;
    }
};

export default cartReducer;
