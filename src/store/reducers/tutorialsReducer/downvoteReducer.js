import * as actions from "../../actions/actionTypes";

const initialState = {
  loading: false,
  data:0,
  error: null
};

const DownvoteReducer = (state = initialState, { type, payload }) => {
  switch (type) {


    case actions.DOWNVOTE_START:

      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.DOWNVOTE_SUCCESS:

      return {
        ...state,
        data:payload,
        loading: false,
        error: false
      };

    case actions.DOWNVOTE_FAIL:

      return {
        ...state,
        loading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default DownvoteReducer;
