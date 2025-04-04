import {
  ORDERS_LOADING,
  ORDERS_SUCCESS,
  ORDERS_FAIL,
  ORDERS_UPDATE_SUCCESS,
  ORDERS_UPDATE_FAIL,
  ORDERS_CREATE_LOADING,
  ORDERS_CREATE_SUCCESS,
  ORDERS_CREATE_FAIL
} from '../Actions/orderActions';

const initialState = {
  orders: [],
  loading: false,
  error: null,
  success: false,
  orderCreated: null
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

    case ORDERS_CREATE_LOADING:
      return {
        ...state,
        loading: true,
        error: null
      };

    case ORDERS_CREATE_SUCCESS:
      return {
        ...state,
        loading: false,
        orderCreated: action.payload, // Store the newly created order
        success: true,
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

    case ORDERS_CREATE_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload
      };

    default:
      return state;
    // case ORDERS_LOADING:
    //   return {
    //     ...state,
    //     loading: true,
    //     error: null
    //   };

    // case ORDERS_SUCCESS:
    //   return {
    //     ...state,
    //     loading: false,
    //     orders: action.payload,
    //     error: null
    //   };

    // case ORDERS_FAIL:
    //   return {
    //     ...state,
    //     loading: false,
    //     error: action.payload
    //   };

    // case ORDERS_UPDATE_SUCCESS:
    //   return {
    //     ...state,
    //     success: true,
    //     orders: state.orders.map(order =>
    //       order._id === action.payload._id ? action.payload : order
    //     )
    //   };

    // case ORDERS_UPDATE_FAIL:
    //   return {
    //     ...state,
    //     success: false,
    //     error: action.payload
    //   };



    // default:
    //   return state;
  }
}