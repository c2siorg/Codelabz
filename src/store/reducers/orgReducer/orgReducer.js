const initialState = {
    organizations: [],
    loading: false,
    error: null
  };
  
  export const organizationReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'GET_ALL_ORGANIZATIONS_START':
        return {
          ...state,
          loading: true,
          error: null
        };
      case 'GET_ALL_ORGANIZATIONS_SUCCESS':
        return {
          ...state,
          organizations: action.payload,
          loading: false
        };
      case 'GET_ALL_ORGANIZATIONS_FAIL':
        return {
          ...state,
          loading: false,
          error: action.payload
        };
      default:
        return state;
    }
  };
  