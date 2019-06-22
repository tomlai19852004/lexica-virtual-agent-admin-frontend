import { types } from './Action';
import { apply, takeLatest } from 'redux-saga/effects';
import { AnyAction } from 'redux';

import { createAsyncSaga } from '../../../commons/AsyncActions';
import { api } from '../../../commons/Api';
import { fetchResources } from '../Action';

const updateResponse =
  createAsyncSaga((action: AnyAction) => apply(api, api.updateResponse, [
    action.payload,
  ]));

const deleteResponse =
  createAsyncSaga((action: AnyAction) => apply(api, api.deleteResponse, [
    action.payload,
  ]));

export default function* () {
  yield takeLatest(types.ASYNC_UPDATE_RESPONSE, updateResponse);
  yield takeLatest(types.ASYNC_DELETE_RESPONSE, deleteResponse);
}
