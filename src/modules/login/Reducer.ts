import { combineReducers, AnyAction } from 'redux';
import { reducer as authorizer } from './login-form';

export default combineReducers({
  authorizer,
});
