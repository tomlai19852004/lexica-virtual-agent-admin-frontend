import { combineReducers, AnyAction } from 'redux';
import { types } from './Actions';
import { asyncSuccessful } from '../../commons/AsyncActions';
import { reducer as error } from './error-message';

const FETCH_SUSPEND_AUTO_REPLY_CONFIG_SUCCESSFUL
  = asyncSuccessful(types.ASYNC_FETCH_SUSPEND_AUTO_REPLY_CONFIG);

const suspendAutoReply = (state = false, action: AnyAction) => {
  switch (action.type) {
    case FETCH_SUSPEND_AUTO_REPLY_CONFIG_SUCCESSFUL:
      return action.payload.SUSPEND_AUTO_REPLY;
    case types.ASYNC_UPDATE_SUSPEND_AUTO_REPLY_CONFIG:
      return action.value;
    default:
      return state;
  }
};

const sidebar = (state = { active: false }, action: AnyAction) => {
  switch (action.type) {
    case types.TOGGLE_SIDEBAR:
      return Object.assign({}, state, { active: !state.active });
    case types.CLOSE_SIDEBAR:
      return { active: false };
    default:
      return state;
  }
};

export default combineReducers({
  suspendAutoReply,
  sidebar,
  error,
});
