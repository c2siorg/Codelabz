import * as actions from "../../actions/actionTypes";

const initialState = {
  users: []
};

const FetchUserReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.FETCH_USERS_SUCCESS:
      return {
        ...state,
        users: action.payload
      };
    default:
      return state;
  }
};

export default FetchUserReducer;
