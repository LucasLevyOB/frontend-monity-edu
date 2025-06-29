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
        // "user\":{\"token\":\"eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJlMjVmNTg5Mi02YmViLTRlYzAtYmU0ZS1mMjI3MTczOTQxNjQiLCJpYXQiOjE3NTExNDgzMDAsImV4cCI6MTc1MTIzNDcwMH0.rDMmy-EC91a5hRN17iZPx1NUBMOtateI41oFTM7yTGA\",\"id\":\"e25f5892-6beb-4ec0-be4e-f22717394164\",\"nome\":\"Jose\",\"email\":\"jose@gmail.com\",\"userType\":\"MONITOR\",\"expirationTime\":\"2025-06-29T22:05:00Z\"}
        /**
         * @property {boolean} isAuthenticated - Indicates if the user is authenticated.
         * @property {Object|null} user - The user object containing user details or null if not authenticated.
         * @property {string} user.token - The JWT token for the authenticated user.
         * @property {string} user.id - The unique identifier for the user.
         * @property {string} user.nome - The name of the user.
         * @property {string} user.email - The email address of the user.
         * @property {string} user.userType - The type of user (e.g., MONITOR).
         * @property {string} user.expirationTime - The expiration time of the user's session.
         */
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export default authReducer;