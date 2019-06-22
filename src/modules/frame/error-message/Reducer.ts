import { AnyAction } from 'redux';

import { types } from './Action';

export const error = (state = {}, action: AnyAction) => {
  if (action.type === types.UPDATE_ERROR_MESSAGE) {
    return {
      message: action.payload.error,
    };
  }

  return state;
};
