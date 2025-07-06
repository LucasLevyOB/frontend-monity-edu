const initialState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "UPDATE_USER_STATUS":
      return {
        ...state,
        user: {
          ...state.user,
          status: action.payload,
        },
      };
    default:
      return state;
  }
};

export default authReducer;