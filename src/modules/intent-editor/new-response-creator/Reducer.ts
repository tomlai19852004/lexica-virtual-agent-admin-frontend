import { AnyAction, combineReducers } from 'redux';
import merge from 'lodash-es/merge';
import { asyncFetching, asyncSuccessful } from '../../../commons/AsyncActions';
import { types } from './Action';

const ASYNC_SUCCESSFUL_SUBMIT_REQUEST = asyncSuccessful(types.ASYNC_SUBMIT_REQUEST);
const ASYNC_FETCHING_SUBMIT_REQUEST = asyncFetching(types.ASYNC_SUBMIT_REQUEST);

const  creator = (
  state = {
    open: false, loading: false, subCat: '', confirm: false,
  },
  action: AnyAction) => {

  if (action.type === ASYNC_FETCHING_SUBMIT_REQUEST) {
    return merge({}, state, { loading: true, confirm: false });
  }

  if (action.type === ASYNC_SUCCESSFUL_SUBMIT_REQUEST) {
    return merge({}, state, { loading: false, open: false });
  }

  if (action.type === types.OPEN_CREATOR) {
    return merge({}, state, { open: true, subCat: action.payload });
  }

  if (action.type === types.CLOSE_CREATOR) {
    return merge({}, state, { open: false });
  }

  if (action.type === types.OPEN_CONFIRM) {
    return merge({}, state, { confirm: true });
  }

  if (action.type === types.CLOSE_CONFIRM) {
    return merge({}, state, { confirm: false });
  }

  return state;
};

export default creator;
