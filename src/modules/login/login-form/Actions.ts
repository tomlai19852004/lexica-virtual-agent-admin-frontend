const types = {
  ASYNC_LOGIN_REQUEST: 'LOGIN:LOGIN_REQUEST.ASYNC',
  ASYNC_FETCH_TOKEN_TYPES: 'LOGIN:FETCH_TOKEN_TYPES.ASYNC',
  ASYNC_VALIDATE: 'LOGIN:AUTHENTICATOR:VALIDATE.ASYNC',
  USER_LOGOUT: 'LOGIN:USER_LOGOUT',
};

const loginRequest = (formData: object) => ({
  ...formData,
  type: types.ASYNC_LOGIN_REQUEST,
});

const fetchTokenTypes = () => ({
  type: types.ASYNC_FETCH_TOKEN_TYPES,
});

const logout = () => ({
  type: types.USER_LOGOUT,
});

const validateUser = () => ({
  type: types.ASYNC_VALIDATE,
});

export {
  types,
  loginRequest,
  fetchTokenTypes,
  logout,
  validateUser,
};
