import { combineReducers, AnyAction } from 'redux';
import { types } from './Actions';
import { unionBy } from 'lodash';
import { asyncSuccessful, asyncFetching } from '../../../commons/AsyncActions';

const SEND_CONVERSATION_MESSAGE_SUCCESSFUL =
  asyncSuccessful(types.ASYNC_SEND_CONVERSATION_MESSAGE);

const unsentMessage = (state: {[key: string]: any} = {} , action: AnyAction) => {
  switch (action.type) {
    case types.HOLD_UNSENT_MESSAGE:
      return Object.assign({}, state, action.payload);
    case SEND_CONVERSATION_MESSAGE_SUCCESSFUL:
      return Object.assign({}, state, { [action.conversation.id]: undefined });
    default:
      return state;
  }
};

export default combineReducers({
  unsentMessage,
});
