import { 
    ORDERS_LOADING,
    ORDERS_SUCCESS,
    ORDERS_FAIL,
    ORDERS_UPDATE_SUCCESS,
    ORDERS_UPDATE_FAIL
  } from '../Actions/orderActions';
  
  const initialState = {
    orders: [],
    loading: false,
    error: null,
    success: false
  };
  
  export default function orderReducer(state = initialState, action) {
    switch (action.type) {
      case ORDERS_LOADING:
        return {
          ...state,
          loading: true,
          error: null
        };
      
      case ORDERS_SUCCESS:
        return {
          ...state,
          loading: false,
          orders: action.payload,
          error: null
        };
      
      case ORDERS_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      
      case ORDERS_UPDATE_SUCCESS:
        return {
          ...state,
          success: true,
          orders: state.orders.map(order => 
            order._id === action.payload._id ? action.payload : order
          )
        };
      
      case ORDERS_UPDATE_FAIL:
        return {
          ...state,
          success: false,
          error: action.payload
        };
      
      default:
        return state;
    }
  }