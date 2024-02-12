import * as actions from "../../actions/actionTypes";

const initialState = {
  loading: false,
  data:0,
  error: null
};

const UpvoteReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    

    case actions.UPVOTE_START:
   
      return {
        ...state,
        loading: true,
        error: null
      };

    case actions.UPVOTE_SUCCESS:
    
      return {
        ...state,
        loading: false,
        data:payload,
        error: false
      };

    case actions.UPVOTE_FAIL:
   
      return {
        ...state,
        loading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default UpvoteReducer;
