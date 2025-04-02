// Redux/Reducers/reviewReducer.js
import {
    REVIEW_CREATE_REQUEST,
    REVIEW_CREATE_SUCCESS,
    REVIEW_CREATE_FAIL,
    REVIEW_UPDATE_REQUEST,
    REVIEW_UPDATE_SUCCESS,
    REVIEW_UPDATE_FAIL,
    REVIEW_LIST_BY_PRODUCT_REQUEST,
    REVIEW_LIST_BY_PRODUCT_SUCCESS,
    REVIEW_LIST_BY_PRODUCT_FAIL,
    CHECK_USER_REVIEW_REQUEST,
    CHECK_USER_REVIEW_SUCCESS,
    CHECK_USER_REVIEW_FAIL,
    CHECK_CAN_REVIEW_REQUEST,
    CHECK_CAN_REVIEW_SUCCESS,
    CHECK_CAN_REVIEW_FAIL
} from '../Actions/reviewActions';

const initialState = {
    reviews: [],
    userReview: null,
    canReview: false,
    loading: false,
    error: null,
    success: false
};

export default function reviewReducer(state = initialState, action) {
    switch (action.type) {
        // Create review
        case REVIEW_CREATE_REQUEST:
            return { 
                ...state, 
                loading: true 
            };
        case REVIEW_CREATE_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                success: true,
                userReview: action.payload
            };
        case REVIEW_CREATE_FAIL:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };
            
        // Update review
        case REVIEW_UPDATE_REQUEST:
            return { 
                ...state, 
                loading: true 
            };
        case REVIEW_UPDATE_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                success: true,
                userReview: action.payload
            };
        case REVIEW_UPDATE_FAIL:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };
            
        // List reviews by product
        case REVIEW_LIST_BY_PRODUCT_REQUEST:
            return { 
                ...state, 
                loading: true 
            };
        case REVIEW_LIST_BY_PRODUCT_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                reviews: action.payload 
            };
        case REVIEW_LIST_BY_PRODUCT_FAIL:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };
            
        // Check if user has already reviewed product
        case CHECK_USER_REVIEW_REQUEST:
            return { 
                ...state, 
                loading: true 
            };
        case CHECK_USER_REVIEW_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                userReview: action.payload 
            };
        case CHECK_USER_REVIEW_FAIL:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };
            
        // Check if user can review product
        case CHECK_CAN_REVIEW_REQUEST:
            return { 
                ...state, 
                loading: true 
            };
        case CHECK_CAN_REVIEW_SUCCESS:
            return { 
                ...state, 
                loading: false, 
                canReview: action.payload 
            };
        case CHECK_CAN_REVIEW_FAIL:
            return { 
                ...state, 
                loading: false, 
                error: action.payload 
            };
            
        default:
            return state;
    }
}