import { all, take, takeLatest, put, fork, apply } from 'redux-saga/effects';
import { types } from './Actions';
import { AnyAction } from 'redux';
import isNil from 'lodash-es/isNil';
import { reset } from 'redux-form';
import { formName } from './ConnectedRating';
import { createAsyncSaga, asyncSuccessful } from '../../../../commons/AsyncActions';
import { api } from '../../../../commons/Api';

const SUBMIT_REVIEW_SUCCESSFUL = asyncSuccessful(types.ASYNC_SUBMIT_REVIEW);

const submitReviewAsync = createAsyncSaga((action: AnyAction) => apply(
  api,
  api.submitCommentRating,
  [
    action.payload.id,
    action.payload.messageId,
    action.payload.data,
  ],
));

function* submitReviewListener() {
  yield takeLatest(types.ASYNC_SUBMIT_REVIEW, submitReviewAsync);
}

function* resetForm() {
  yield put(reset(formName));
}

function* formChangeListener() {
  yield takeLatest([types.CLOSE_RATING, SUBMIT_REVIEW_SUCCESSFUL], resetForm);
}

export default function* () {
  yield all([
    fork(formChangeListener),
    fork(submitReviewListener),
  ]);
}
