import { AnyAction } from 'redux';
import {
  all,
  apply,
  put,
  fork,
  takeLatest,
  AllEffect,
  ForkEffect,
  select,
} from 'redux-saga/effects';
import { createAsyncSaga, asyncSuccessful } from '../../../../commons/AsyncActions';
import { api } from '../../../../commons/Api';
import { types } from './Actions';

const sendEmailAsync = createAsyncSaga((action: AnyAction) => apply(
  api,
  api.sendEmail,
  [
    action.payload.mailTo.replace(/\s/, '').split(','),
    action.payload.subject,
    action.payload.body.replace(/\n/ig, '<br />'),
  ],
));

function* sendEmailListener() {
  yield takeLatest(types.ASYNC_SEND_EMAIL, sendEmailAsync);
}

export default function* sage() {
  yield all([
    fork(sendEmailListener),
  ]);
}
