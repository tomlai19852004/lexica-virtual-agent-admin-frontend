import { AnyAction } from 'redux';
import {
  call,
  put,
  CallEffect,
  PutEffect,
} from 'redux-saga/effects';

const FETCHING = '.FETCHING';
const SUCCESSFUL = '.SUCCESSFUL';
const FAILURE = '.FAILURE';

const asyncStatusFactory = (suffix: string) => (actionType: string) => actionType + suffix;
const asyncActionFactory = (suffix: string) => (action: AnyAction) => ({
  ...action,
  type: action.type + suffix,
});
const isAsyncAction = (action: AnyAction) => (<string>action.type).endsWith('.ASYNC');

const asyncFetching = asyncStatusFactory(FETCHING);
const asyncSuccessful = asyncStatusFactory(SUCCESSFUL);
const asyncFailure = asyncStatusFactory(FAILURE);

const asyncActionFetching = asyncActionFactory(FETCHING);
const asyncActionSuccessful = asyncActionFactory(SUCCESSFUL);
const asyncActionFailure = asyncActionFactory(FAILURE);

const createAsyncSaga = (logic: (action: AnyAction) => CallEffect) => {
  return function* (action: AnyAction) {
    yield put(asyncActionFetching(action));
    try {
      const payload = yield logic(action);
      yield put(asyncActionSuccessful({
        ...action,
        payload,
        previousActionPayload: action.payload,
      }));
    } catch (error) {
      console.log(error);
      yield put(asyncActionFailure({
        ...action,
        payload: error,
        error: true,
      }));
    }
  };
};

export {
  createAsyncSaga,
  isAsyncAction,
  asyncFetching,
  asyncSuccessful,
  asyncFailure,
};
