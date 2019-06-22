import { combineReducers } from 'redux';
import { reducer as dateRangePicker } from './date-range-picker';
import { reducer as traffic } from './traffic';
import { reducer as autoReplyComment } from './auto-reply-comment';

export default combineReducers({
  dateRangePicker,
  traffic,
  autoReplyComment,
});
