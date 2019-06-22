import { apply, takeLatest, all } from 'redux-saga/effects';

import { createAsyncSaga } from '../../../commons/AsyncActions';
import { api } from '../../../commons/Api';
import { types } from './Action';

const submitRequest =
  createAsyncSaga(action => apply(api, api.createNewResponse, [action.payload]));

export default function* sage() {
  yield all([
    takeLatest(types.ASYNC_SUBMIT_REQUEST, submitRequest),
  ]);
}
