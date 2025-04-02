// Redux/Actions/reviewActions.js
import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

// Review action types
export const REVIEW_CREATE_REQUEST = 'REVIEW_CREATE_REQUEST';
export const REVIEW_CREATE_SUCCESS = 'REVIEW_CREATE_SUCCESS';
export const REVIEW_CREATE_FAIL = 'REVIEW_CREATE_FAIL';

export const REVIEW_UPDATE_REQUEST = 'REVIEW_UPDATE_REQUEST';
export const REVIEW_UPDATE_SUCCESS = 'REVIEW_UPDATE_SUCCESS';
export const REVIEW_UPDATE_FAIL = 'REVIEW_UPDATE_FAIL';

export const REVIEW_LIST_BY_PRODUCT_REQUEST = 'REVIEW_LIST_BY_PRODUCT_REQUEST';
export const REVIEW_LIST_BY_PRODUCT_SUCCESS = 'REVIEW_LIST_BY_PRODUCT_SUCCESS';
export const REVIEW_LIST_BY_PRODUCT_FAIL = 'REVIEW_LIST_BY_PRODUCT_FAIL';

export const CHECK_USER_REVIEW_REQUEST = 'CHECK_USER_REVIEW_REQUEST';
export const CHECK_USER_REVIEW_SUCCESS = 'CHECK_USER_REVIEW_SUCCESS';
export const CHECK_USER_REVIEW_FAIL = 'CHECK_USER_REVIEW_FAIL';

export const CHECK_CAN_REVIEW_REQUEST = 'CHECK_CAN_REVIEW_REQUEST';
export const CHECK_CAN_REVIEW_SUCCESS = 'CHECK_CAN_REVIEW_SUCCESS';
export const CHECK_CAN_REVIEW_FAIL = 'CHECK_CAN_REVIEW_FAIL';

export const REVIEW_DELETE_REQUEST = 'REVIEW_DELETE_REQUEST';
export const REVIEW_DELETE_SUCCESS = 'REVIEW_DELETE_SUCCESS';
export const REVIEW_DELETE_FAIL = 'REVIEW_DELETE_FAIL';

// Create a review
export const createReview = (productId, reviewData, token) => async (dispatch) => {
    try {
        dispatch({ type: REVIEW_CREATE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.post(
            `${baseURL}/review/create`, 
            { ...reviewData, product: productId },
            config
        );

        dispatch({
            type: REVIEW_CREATE_SUCCESS,
            payload: data.review
        });

        // Refresh user's review status
        await dispatch(checkUserReview(productId, token));

        // Refresh the reviews list for the product
        dispatch(listReviewsByProduct(productId));

    } catch (error) {
        dispatch({
            type: REVIEW_CREATE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Update a review
export const updateReview = (productId, reviewId, reviewData, token) => async (dispatch) => {
    try {
        dispatch({ type: REVIEW_UPDATE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.put(
            `${baseURL}/review/update/${productId}/${reviewId}`, 
            reviewData,
            config
        );

        dispatch({
            type: REVIEW_UPDATE_SUCCESS,
            payload: data.review
        });

        // Refresh the reviews list for the product
        dispatch(listReviewsByProduct(productId));

    } catch (error) {
        dispatch({
            type: REVIEW_UPDATE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Get all reviews for a product
export const listReviewsByProduct = (productId) => async (dispatch) => {
    try {
        dispatch({ type: REVIEW_LIST_BY_PRODUCT_REQUEST });

        const { data } = await axios.get(`${baseURL}/review/byProduct/${productId}`);
        console.log('Reviews response:', data);


        dispatch({
            type: REVIEW_LIST_BY_PRODUCT_SUCCESS,
            payload: data.reviews
        });
    } catch (error) {
        dispatch({
            type: REVIEW_LIST_BY_PRODUCT_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Check if user has already reviewed a product
export const checkUserReview = (productId, token) => async (dispatch) => {
    try {
        dispatch({ type: CHECK_USER_REVIEW_REQUEST });

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.get(
            `${baseURL}/review/check/${productId}`, 
            config
        );

        dispatch({
            type: CHECK_USER_REVIEW_SUCCESS,
            payload: data.review // This will be null if no review exists
        });

        return data.review;
    } catch (error) {
        dispatch({
            type: CHECK_USER_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message
        });
        return null;
    }
};

// Check if user can review a product (has purchased it and order is delivered)
export const checkCanReview = (productId, token) => async (dispatch) => {
    try {
        dispatch({ type: CHECK_CAN_REVIEW_REQUEST });

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.get(
            `${baseURL}/review/can-review/${productId}`, 
            config
        );

        dispatch({
            type: CHECK_CAN_REVIEW_SUCCESS,
            payload: data.canReview
        });

        return data.canReview;
    } catch (error) {
        dispatch({
            type: CHECK_CAN_REVIEW_FAIL,
            payload: error.response?.data?.message || error.message
        });
        return false;
    }
};

// export const deleteReview = (productId, reviewId, token) => async (dispatch) => {
//     try {
//         dispatch({ type: REVIEW_DELETE_REQUEST });

//         const config = {
//             headers: {
//                 'Authorization': `Bearer ${token}`
//             }
//         };

//         await axios.delete(
//             `${baseURL}/review/delete/${productId}/${reviewId}`, 
//             config
//         );

//         dispatch({
//             type: REVIEW_DELETE_SUCCESS,
//             payload: reviewId
//         });

//         // Refresh the reviews list for the product
//         dispatch(listReviewsByProduct(productId));

//     } catch (error) {
//         dispatch({
//             type: REVIEW_DELETE_FAIL,
//             payload: error.response?.data?.message || error.message
//         });
//     }
// };