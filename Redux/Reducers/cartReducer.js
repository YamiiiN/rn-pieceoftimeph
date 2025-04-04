import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    UPDATE_QUANTITY,
    TOGGLE_SELECTION,
    CLEAR_CART,
    SET_SELECTED_ITEMS_FOR_CHECKOUT,
    FETCH_CART_ITEMS,
    REMOVE_SELECTED_ITEMS
} from '../Actions/cartActions';

const initialState = {
    cartItems: [],
    cartCount: 0,
    selectedItemsForCheckout: []
};
const cartReducer = (state = initialState, action) => {
    switch (action.type) {

        case ADD_TO_CART: {
            const existingItemIndex = state.cartItems.findIndex(item => item.id === action.payload.id);

            if (existingItemIndex !== -1) {
                const updatedCartItems = [...state.cartItems];
                const existingItem = updatedCartItems[existingItemIndex];

                updatedCartItems[existingItemIndex] = {
                    ...existingItem,
                    quantity: existingItem.quantity + action.payload.quantity,
                    selected: existingItem.selected // preserve selection
                };

                return {
                    ...state,
                    cartItems: updatedCartItems,
                    cartCount: state.cartCount + action.payload.quantity
                };
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, {
                        ...action.payload,
                        selected: true
                    }],
                    cartCount: state.cartCount + action.payload.quantity
                };
            }
        }

        case REMOVE_FROM_CART: {
            const removedItem = state.cartItems.find(item => item.id === action.payload);
            return {
                ...state,
                cartItems: state.cartItems.filter(item => item.id !== action.payload),
                cartCount: removedItem
                    ? state.cartCount - removedItem.quantity
                    : state.cartCount
            };
        }

        case UPDATE_QUANTITY: {
            const updatedCartItems = state.cartItems.map(item =>
                item.id === action.payload.id
                    ? { ...item, quantity: Math.max(1, action.payload.quantity) }
                    : item
            );

            const updatedCount = updatedCartItems.reduce((total, item) => total + item.quantity, 0);

            return {
                ...state,
                cartItems: updatedCartItems,
                cartCount: updatedCount
            };
        }

        case TOGGLE_SELECTION: {
            const updatedCartItems = state.cartItems.map(item =>
                item.id === action.payload
                    ? { ...item, selected: !item.selected }
                    : item
            );

            return {
                ...state,
                cartItems: updatedCartItems
            };
        }

        case CLEAR_CART:
            return {
                ...state,
                cartItems: [],
                cartCount: 0,
                selectedItemsForCheckout: []
            };

        case SET_SELECTED_ITEMS_FOR_CHECKOUT:
            return {
                ...state,
                selectedItemsForCheckout: action.payload
            };

        case FETCH_CART_ITEMS: {
            const newCartItems = action.payload.map(item => ({
                ...item,
                selected: item.selected !== undefined ? item.selected : true
            }));

            const newCartCount = newCartItems.reduce((total, item) => total + item.quantity, 0);

            return {
                ...state,
                cartItems: newCartItems,
                cartCount: newCartCount
            };
        }

        case REMOVE_SELECTED_ITEMS: {
            const nonSelectedItems = state.cartItems.filter(item => !item.selected);
            const updatedCount = nonSelectedItems.reduce((total, item) => total + item.quantity, 0);

            return {
                ...state,
                cartItems: nonSelectedItems,
                cartCount: updatedCount
            };
        }

        default:
            return state;
    }
};

export default cartReducer;