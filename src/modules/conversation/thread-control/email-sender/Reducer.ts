import { combineReducers, AnyAction } from 'redux';
import { types } from './Actions';
import { unionBy, remove } from 'lodash-es';
import { asyncSuccessful, asyncFailure } from '../../../../commons/AsyncActions';

const SEND_EMAIL_SUCCESSFUL = asyncSuccessful(types.ASYNC_SEND_EMAIL);
const SEND_EMAIL_FAILURE = asyncFailure(types.ASYNC_SEND_EMAIL);

const status = (state = { open: false, sending: false }, action: AnyAction) => {
  switch (action.type) {
    case types.OPEN_EMAIL_SENDER:
      return Object.assign({}, state, { open: true });
    case types.CLOSE_EMAIL_SENDER:
      return Object.assign({}, state, { open: false });
    case types.ASYNC_SEND_EMAIL:
      return Object.assign({}, state, { sending: true });
    case SEND_EMAIL_SUCCESSFUL:
      return Object.assign({}, state, { open: false, sending: false });
    case SEND_EMAIL_FAILURE:
      return Object.assign({}, state, { sending: false });
    default:
      return state;
  }
};

const warning = (state = '', action: AnyAction) => {
  switch (action.type) {
    case SEND_EMAIL_FAILURE:
      return 'fail';
    case types.CLOSE_EMAIL_SENDER: // reset warning
      return '';
    default:
      return state;
  }
};

export default combineReducers({
  status,
  warning,
});
