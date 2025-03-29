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
    PRODUCT_DELETE_FAIL
} from '../Actions/productActions';

const initialState = {
    products: [],
    loading: false,
    error: null,
    success: false
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
        
        default:
            return state;
    }
}