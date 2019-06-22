import { combineReducers, AnyAction } from 'redux';
import { reducer as list } from './list';
import { reducer as thread } from './thread';
import { reducer as suggest } from './thread-control/suggested-answer';
import { reducer as emailSender } from './thread-control/email-sender';

const defaultPageSize = (defaultPageSize = 20) => {
  return defaultPageSize;
};

export default combineReducers({
  list,
  thread,
  suggest,
  emailSender,
  defaultPageSize,
});
