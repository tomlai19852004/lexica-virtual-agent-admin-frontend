import { AnyAction } from 'redux';

import { types } from './Action';
import { asyncFetching, asyncSuccessful } from '../../../commons/AsyncActions';

type editorState = {
  name: string,
  active: boolean,
  loading: boolean,
};

export const UPDATE_RESPONSE_SUCCESSFUL = asyncSuccessful(types.ASYNC_UPDATE_RESPONSE);
const UPDATE_RESPONSE_FETCHING = asyncFetching(types.ASYNC_UPDATE_RESPONSE);

export const DELETE_RESPONSE_SUCCESSFUL = asyncSuccessful(types.ASYNC_DELETE_RESPONSE);
const DELETE_RESPONSE_FETCHING = asyncFetching(types.ASYNC_DELETE_RESPONSE);

export default (status = { name: '', active: false, loading: false }, action: AnyAction) => {
  if (action.type === types.START_EDIT) {
    return Object.assign({}, status, { name: action.payload.command, active: true });
  }

  if (action.type === UPDATE_RESPONSE_FETCHING || action.type === DELETE_RESPONSE_FETCHING) {
    return Object.assign({}, status, { loading: true });
  }

  if (
    action.type === UPDATE_RESPONSE_SUCCESSFUL ||
    action.type === types.CANCEL_EDIT ||
    action.type === DELETE_RESPONSE_SUCCESSFUL
  ) {
    return Object.assign({}, status, { active: false, loading: false });
  }

  return status;
};
