import {
    PRODUCT_CREATE_REQUEST,
    PRODUCT_CREATE_SUCCESS,
    PRODUCT_CREATE_FAIL,
    PRODUCT_UPDATE_REQUEST,
    PRODUCT_UPDATE_SUCCESS,
    PRODUCT_UPDATE_FAIL,
    PRODUCT_LIST_REQUEST,
    PRODUCT_LIST_SUCCESS,
    PRODUCT_LIST_FAIL,
    PRODUCT_DELETE_REQUEST,
    PRODUCT_DELETE_SUCCESS,
    PRODUCT_DELETE_FAIL,
    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,
    CATEGORY_PRODUCTS_REQUEST,
    CATEGORY_PRODUCTS_SUCCESS,
    CATEGORY_PRODUCTS_FAIL
} from '../Actions/productActions';

// const initialState = {
//     products: [],
//     categories: [],
//     categoryProducts: [],
//     loading: false,
//     error: null,
//     success: false
// };

const initialState = {
    products: [],
    categories: [],
    categoryProducts: [],
    loading: false,
    error: null,
    success: false,
    productsLoading: false,
    productsError: null
};


export default function productReducer(state = initialState, action) {
    switch (action.type) {
        // Create product
        case PRODUCT_CREATE_REQUEST:
            return { ...state, loading: true };
        case PRODUCT_CREATE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                products: [...state.products, action.payload]
            };
        case PRODUCT_CREATE_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Update product
        case PRODUCT_UPDATE_REQUEST:
            return { ...state, loading: true };
        case PRODUCT_UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                products: state.products.map(product =>
                    product._id === action.payload._id ? action.payload : product
                )
            };
        case PRODUCT_UPDATE_FAIL:
            return { ...state, loading: false, error: action.payload };

        // List products
        case PRODUCT_LIST_REQUEST:
            return { ...state, loading: true };
        case PRODUCT_LIST_SUCCESS:
            return { ...state, loading: false, products: action.payload };
        case PRODUCT_LIST_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Delete product
        case PRODUCT_DELETE_REQUEST:
            return { ...state, loading: true };
        case PRODUCT_DELETE_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true
            };
        case PRODUCT_DELETE_FAIL:
            return { ...state, loading: false, error: action.payload };

        case CATEGORY_LIST_REQUEST:
            return { ...state, loading: true };
        case CATEGORY_LIST_SUCCESS:
            return { ...state, loading: false, categories: action.payload };
        case CATEGORY_LIST_FAIL:
            return { ...state, loading: false, error: action.payload };

        // List products by category
        case CATEGORY_PRODUCTS_REQUEST:
            return { ...state, productsLoading: true };
        case CATEGORY_PRODUCTS_SUCCESS:
            return { ...state, productsLoading: false, categoryProducts: action.payload };
        case CATEGORY_PRODUCTS_FAIL:
            return { ...state, productsLoading: false, productsError: action.payload };

        default:
            return state;
    }
}