import { AnyAction } from 'redux';
import {
  all,
  apply,
  fork,
  select,
  takeLatest,
  put,
  ForkEffect,
  AllEffect,
} from 'redux-saga/effects';
import { api } from '../../commons/Api';
import { createAsyncSaga, asyncSuccessful } from '../../commons/AsyncActions';
import { types } from './Actions';
import { saga as errorSaga } from './error-message';

const fetchSuspendAutoReplyConfig =
  createAsyncSaga((action: AnyAction) => apply(api, api.fetchSuspendAutoReplyConfig));

const updateSuspendAutoReplyConfig =
  createAsyncSaga((action: AnyAction) => apply(
    api, api.updateSuspendAutoReplyConfig, [!action.value]));

function* fetchSuspendAutoReplyConfigListener() {
  yield takeLatest(types.ASYNC_FETCH_SUSPEND_AUTO_REPLY_CONFIG, fetchSuspendAutoReplyConfig);
}

function* updateSuspendAutoReplyConfigListener() {
  yield takeLatest(types.ASYNC_UPDATE_SUSPEND_AUTO_REPLY_CONFIG, updateSuspendAutoReplyConfig);
}

function* saga() {
  yield all([
    fork(fetchSuspendAutoReplyConfigListener),
    fork(updateSuspendAutoReplyConfigListener),
    fork(errorSaga),
  ]);
}

export default saga;
