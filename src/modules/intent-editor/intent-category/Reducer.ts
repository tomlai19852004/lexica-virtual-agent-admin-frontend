import { AnyAction } from 'redux';
import { types } from './Action';

export default (status = '', action: AnyAction) => {
  if (action.type === types.SELECT_CATEGORY) {
    return action.cat;
  }

  if (action.type === types.RESET_CATEGORY) {
    return '';
  }

  return status;
};
