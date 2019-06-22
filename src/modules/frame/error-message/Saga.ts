import { AnyAction }  from 'redux';
import {
  takeEvery,
  put,
} from 'redux-saga/effects';

import { updateError } from './Action';

function* saga() {
  yield takeEvery('*', function* (action: AnyAction) {
    if (action.type.endsWith('.ASYNC.FAILURE') && ! action.type.startsWith('LOGIN')) {
      yield put(updateError(action.error));
    }
  });
}

export default saga;
