import {
    FETCH_NOTIFICATIONS_REQUEST,
    FETCH_NOTIFICATIONS_SUCCESS,
    FETCH_NOTIFICATIONS_FAILURE,
    SET_UNREAD_COUNT,
    MARK_AS_READ,
    MARK_ALL_AS_READ,
    DELETE_NOTIFICATION,
    ADD_NOTIFICATION,
    INCREMENT_UNREAD_COUNT,
    DECREMENT_UNREAD_COUNT
} from '../Actions/notificationAction';

const initialState = {
    items: [],
    loading: false,
    error: null,
    unreadCount: 0
};

export default function notificationReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_NOTIFICATIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            };
        case FETCH_NOTIFICATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                items: action.payload,
                error: null
            };
        case FETCH_NOTIFICATIONS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        case SET_UNREAD_COUNT:
            return {
                ...state,
                unreadCount: action.payload
            };
        case MARK_AS_READ:
            return {
                ...state,
                items: state.items.map(item =>
                    item._id === action.payload ? { ...item, read: true } : item
                )
            };
        case MARK_ALL_AS_READ:
            return {
                ...state,
                items: state.items.map(item => ({ ...item, read: true })),
                unreadCount: 0
            };
        case DELETE_NOTIFICATION:
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)
            };
        case ADD_NOTIFICATION: {
            // Check if notification already exists to avoid duplicates
            const exists = state.items.some(item => item._id === action.payload._id);
            if (exists) {
                return state;
            }
            return {
                ...state,
                items: [action.payload, ...state.items]
            };
        }
        case INCREMENT_UNREAD_COUNT:
            return {
                ...state,
                unreadCount: state.unreadCount + 1
            };
        case DECREMENT_UNREAD_COUNT:
            return {
                ...state,
                unreadCount: Math.max(0, state.unreadCount - 1)
            };
        default:
            return state;
    }
}