import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

export const PRODUCT_CREATE_REQUEST = 'PRODUCT_CREATE_REQUEST';
export const PRODUCT_CREATE_SUCCESS = 'PRODUCT_CREATE_SUCCESS';
export const PRODUCT_CREATE_FAIL = 'PRODUCT_CREATE_FAIL';

export const PRODUCT_UPDATE_REQUEST = 'PRODUCT_UPDATE_REQUEST';
export const PRODUCT_UPDATE_SUCCESS = 'PRODUCT_UPDATE_SUCCESS';
export const PRODUCT_UPDATE_FAIL = 'PRODUCT_UPDATE_FAIL';

export const PRODUCT_LIST_REQUEST = 'PRODUCT_LIST_REQUEST';
export const PRODUCT_LIST_SUCCESS = 'PRODUCT_LIST_SUCCESS';
export const PRODUCT_LIST_FAIL = 'PRODUCT_LIST_FAIL';

export const PRODUCT_DELETE_REQUEST = 'PRODUCT_DELETE_REQUEST';
export const PRODUCT_DELETE_SUCCESS = 'PRODUCT_DELETE_SUCCESS';
export const PRODUCT_DELETE_FAIL = 'PRODUCT_DELETE_FAIL';

// Fetch all products
export const listProducts = () => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_LIST_REQUEST });

        const { data } = await axios.get(`${baseURL}/product/get/all`);

        dispatch({
            type: PRODUCT_LIST_SUCCESS,
            payload: data.products
        });
    } catch (error) {
        dispatch({
            type: PRODUCT_LIST_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Create a new product
export const createProduct = (productData, token) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_CREATE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.post(`${baseURL}/product/create`, productData, config);

        dispatch({
            type: PRODUCT_CREATE_SUCCESS,
            payload: data.product
        });

        // After creating, fetch updated product list
        dispatch(listProducts());
    } catch (error) {
        dispatch({
            type: PRODUCT_CREATE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Update an existing product
export const updateProduct = (id, productData, token) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_UPDATE_REQUEST });

        const config = {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        };

        const { data } = await axios.put(`${baseURL}/product/update/${id}`, productData, config);

        dispatch({
            type: PRODUCT_UPDATE_SUCCESS,
            payload: data.product
        });

        // After updating, fetch updated product list
        dispatch(listProducts());
    } catch (error) {
        dispatch({
            type: PRODUCT_UPDATE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};

// Delete a product
export const deleteProduct = (id, token) => async (dispatch) => {
    try {
        dispatch({ type: PRODUCT_DELETE_REQUEST });

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        await axios.delete(`${baseURL}/product/delete/${id}`, config);

        dispatch({ type: PRODUCT_DELETE_SUCCESS });

        // After deleting, fetch updated product list
        dispatch(listProducts());
    } catch (error) {
        dispatch({
            type: PRODUCT_DELETE_FAIL,
            payload: error.response?.data?.message || error.message
        });
    }
};
