import { combineReducers, AnyAction } from 'redux';

import { asyncSuccessful, asyncFetching } from '../../../../commons/AsyncActions';
import { types } from './Action';
import { types as listTypes } from '../../list/Actions';
import { types as threadTypes } from '../../thread/Actions';

const FETCH_SUGGESTION_SUCCESSFUL = asyncSuccessful(types.ASYNC_FETCHING_SUGGESTION);
const FETCH_SUGGESTION_FETCHING = asyncFetching(types.ASYNC_FETCHING_SUGGESTION);
const FETCH_SUGGESTION_LATEST_ENQUIRY =
  asyncSuccessful(threadTypes.ASYNC_FETCH_SUGGESTION_FOR_LATEST_ENQUIRY);

const counter = (state = 0, action: AnyAction) => {
  switch (action.type) {
    case types.NEXT_SUGGESTION:
      return state + 1;
    case types.PREV_SUGGESTION:
      return state - 1;
    default:
      return state;
  }
};

const status = (status = { open: false, loading: false }, action: AnyAction) => {
  switch (action.type) {
    case types.OPEN_SUGGEST_SELECTOR:
      return { open: true, loading: true };
    case FETCH_SUGGESTION_SUCCESSFUL:
      return { open: status.open, loading: false };
    case types.SELECT_SUGGESTION:
    case types.CLOSE_SUGGESTION_MODAL:
      return { open: false, loading: false };
    case types.TURN_OFF_STATUS_LOADING:
      return { open: status.open, loading: false };
    default:
      return status;
  }
};

const message = (message = '', action: AnyAction) => {
  switch (action.type) {
    case FETCH_SUGGESTION_FETCHING:
      return action.payload;
    default:
      return message;
  }
};

const suggestions = (state = {}, action: AnyAction) => {
  switch (action.type) {
    case FETCH_SUGGESTION_SUCCESSFUL:
      const suggest: {[key: string]: any} = {};
      const msgId = action.previousActionPayload.msgId;
      suggest[msgId] = action.payload;
      return Object.assign({}, state, suggest);
    default:
      return state;
  }
};

export default combineReducers({
  status,
  message,
  counter,
  suggestions,
});
