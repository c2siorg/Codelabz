import * as actions from "../../actions/actionTypes";

const initialState = {
  loading: false,
  error: null,
  homepageFeedArray: [],
  bookmarkpageFeedArray: []
};

const FeedReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.GET_TUTORIAL_FEED_START,
         actions.GET_BOOKMARKED_TUTORIAL_FEED_START:
      return {
        ...state,
        loading: true
      };

    case actions.GET_TUTORIAL_FEED_SUCCESS:
      return {
        ...state,
        loading: false,
        homepageFeedArray: payload,
        bookmarkpageFeedArray: []
      };

    case actions.GET_BOOKMARKED_TUTORIAL_FEED_SUCCESS:
      return {
        ...state,
        loading: false,
        homepageFeedArray: [],
        bookmarkpageFeedArray: payload
      };

    case actions.GET_TUTORIAL_FEED_FAILED,
         actions.GET_BOOKMARKED_TUTORIAL_FEED_FAILED:
      return {
        ...state,
        loading: false,
        error: payload
      };

    default:
      return state;
  }
};

export default FeedReducer;
