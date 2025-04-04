import axios from 'axios';
import baseURL from '../../assets/common/baseUrl';

export const ORDERS_LOADING = 'ORDERS_LOADING';
export const ORDERS_SUCCESS = 'ORDERS_SUCCESS';
export const ORDERS_FAIL = 'ORDERS_FAIL';
export const ORDERS_UPDATE_SUCCESS = 'ORDERS_UPDATE_SUCCESS';
export const ORDERS_UPDATE_FAIL = 'ORDERS_UPDATE_FAIL';
export const ORDERS_CREATE_LOADING = 'ORDERS_CREATE_LOADING';
export const ORDERS_CREATE_SUCCESS = 'ORDERS_CREATE_SUCCESS';
export const ORDERS_CREATE_FAIL = 'ORDERS_CREATE_FAIL';
// Action to fetch all orders of the login user
export const fetchOrders = (token) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ORDERS_LOADING });
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${baseURL}/order/user/orders`, config);
      
      if (response.status === 200) {
        dispatch({
          type: ORDERS_SUCCESS,
          payload: response.data.orders
        });
      }
    } catch (error) {
      console.log('Error fetching orders:', error);
      dispatch({
        type: ORDERS_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to load orders'
      });
    }
  };
};

// Action to fetch all orders for admin
export const fetchAllOrders = (token) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ORDERS_LOADING });
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.get(`${baseURL}/order/all`, config);
      
      if (response.status === 200) {
        dispatch({
          type: ORDERS_SUCCESS,
          payload: response.data.orders
        });
      }
    } catch (error) {
      console.log('Error fetching all orders:', error);
      dispatch({
        type: ORDERS_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to load orders'
      });
    }
  };
};

// Action to update order status
export const updateOrderStatus = (orderId, status, token) => {
  return async (dispatch) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      
      const response = await axios.put(
        `${baseURL}/order/${orderId}`, 
        { status }, 
        config
      );
      
      if (response.status === 200) {
        dispatch({
          type: ORDERS_UPDATE_SUCCESS,
          payload: response.data.order
        });
        
        // Fetch all orders again to refresh the list
        dispatch(fetchAllOrders(token));
      }
    } catch (error) {
      console.log('Error updating order:', error);
      dispatch({
        type: ORDERS_UPDATE_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to update order'
      });
    }
  };
};

export const createOrder = (orderData, token) => {
  return async (dispatch) => {
    try {
      dispatch({ type: ORDERS_CREATE_LOADING });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.post(`${baseURL}/order/create`, orderData, config);

      if (response.status === 200) {
        dispatch({
          type: ORDERS_CREATE_SUCCESS,
          payload: response.data.order, // You can pass the order data from response
        });
      }
    } catch (error) {
      console.log('Error creating order:', error);
      dispatch({
        type: ORDERS_CREATE_FAIL,
        payload: error.response && error.response.data.message
          ? error.response.data.message
          : 'Failed to create order',
      });
    }
  };
};