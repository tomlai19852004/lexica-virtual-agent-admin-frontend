import { AnyAction, Reducer, combineReducers } from 'redux';
import { types } from './Actions';
import { asyncFetching, asyncSuccessful, asyncFailure } from '../../../commons/AsyncActions';

export const LOGIN_SUCCESSFUL = asyncSuccessful(types.ASYNC_LOGIN_REQUEST);
const LOGIN_FAILURE = asyncFailure(types.ASYNC_LOGIN_REQUEST);
const FETCH_TYPES_SUCCESSFUL = asyncSuccessful(types.ASYNC_FETCH_TOKEN_TYPES);

const VALIDATE_FETCHING = asyncFetching(types.ASYNC_VALIDATE);
const VALIDATE_SUCCESSFUL = asyncSuccessful(types.ASYNC_VALIDATE);
const VALIDATE_FAILURE = asyncFailure(types.ASYNC_VALIDATE);

const token = (status = { isAuthorized: false, error: '' }, action: AnyAction) => {
  if (action.type === LOGIN_SUCCESSFUL) {
    return {
      isAuthorized: true,
      token: action.payload.token,
    };
  }

  if (action.type === VALIDATE_SUCCESSFUL) {
    return {
      isAuthorized: action.payload.result,
      token: sessionStorage.getItem('token'),
    };
  }

  if (action.type === types.USER_LOGOUT) {
    return {
      isAuthorized: false,
    };
  }

  return status;
};

const tokenTypes = (status = {}, action: AnyAction) => {
  if (action.type === FETCH_TYPES_SUCCESSFUL) {
    return action.payload;
  }

  return status;
};

const error = (state = '', action: AnyAction) => {
  if (action.type === LOGIN_FAILURE) {
    return action.payload.message;
  }

  return state;
};

const validating = (state = false, action: AnyAction) => {
  switch (action.type) {
    case VALIDATE_FETCHING:
      return true;
    case VALIDATE_SUCCESSFUL:
    case VALIDATE_FAILURE:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  error,
  token,
  tokenTypes,
  validating,
});
