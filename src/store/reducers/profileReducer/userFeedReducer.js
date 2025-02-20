import * as actions from "../../actions/actionTypes";

const initialState = {
    loading: false,
    error: null,
    userFeedArray: []
};

const userFeedReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case actions.GET_USER_FEED_START:
            return {
                ...state,
                loading: true
            };

        case actions.GET_USER_FEED_SUCCESS:
            return {
                ...state,
                loading: false,
                userFeedArray: payload
            };

        case actions.GET_USER_FEED_FAILED:
            return {
                ...state,
                loading: false,
                error: payload
            };

        default:
            return state;
    }
};

export default userFeedReducer;
