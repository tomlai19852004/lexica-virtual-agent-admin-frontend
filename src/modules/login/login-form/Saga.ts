import { AnyAction } from 'redux';
import { apply, takeLatest, fork, put, ForkEffect, all, AllEffect } from 'redux-saga/effects';
import { routerActions } from 'react-router-redux';
import { api } from '../../../commons/Api';
import { createAsyncSaga } from '../../../commons/AsyncActions';
import { types } from './Actions';
import { LOGIN_SUCCESSFUL } from './Reducer';

const login =
  createAsyncSaga((action: AnyAction) => {
    const { username, password, uni } = action;
    return apply(api, api.login, [username, password, uni]);
  });

const fetchTokenTypes =
  createAsyncSaga((action: AnyAction) => apply(api, api.fetchTokenTypes));

const validateUser =
  createAsyncSaga((action: AnyAction) => apply(api, api.validateUser));

function* validateUserListener() {
  yield takeLatest(types.ASYNC_VALIDATE, validateUser);
}

function* saga() {
  yield all([
    takeLatest(types.ASYNC_LOGIN_REQUEST, login),
    takeLatest(types.ASYNC_FETCH_TOKEN_TYPES, fetchTokenTypes),
    takeLatest(types.USER_LOGOUT, function* (action: AnyAction) {
      yield apply(sessionStorage, sessionStorage.removeItem, ['token']);
      yield apply(api, api.setToken, ['']);
    }),
    takeLatest(LOGIN_SUCCESSFUL, function* (action: AnyAction) {
      yield apply(api, api.setToken, [action.payload.token]);
      yield apply(sessionStorage, sessionStorage.setItem, ['token', action.payload.token]);
    }),
    fork(validateUserListener),
  ]);
}

export default saga;
