import { AnyAction } from 'redux';
import { apply, takeLatest, ForkEffect, all, fork, select, call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import { createAsyncSaga, asyncSuccessful } from '../../commons/AsyncActions';
import { api } from '../../commons/Api';
import { types } from './Action';
import { ASYNC_SUCCESSFUL_RESOURCES } from './Reducer';
import { saga as editorFormSaga } from './response-editor';
import { saga as responseCreatorSaga } from './new-response-creator';

const fetchResources =
  createAsyncSaga(action => apply(api, api.fetchResources));

const fetchPendingResources =
  createAsyncSaga(action => apply(api, api.fetchPendingResources));

function* searchIntents() {
  // take latest search term
  yield takeLatest(types.UPDATE_SEARCH_TERM, function* (action: AnyAction) {
    yield call(delay, 300);
    //
    const { sizes, status } = yield select(
      (state: any) => ({
        // status: state.conversation.list.conversationStatus,
        // sizes: state.conversation.list.conversationSize,
      }),
    );
  });
  // fetch intents
}

export default function* sage() {
  yield all([
    takeLatest(types.ASYNC_FETCH_RESOURCES, fetchResources),
    takeLatest(types.ASYNC_FETCH_PENDING_RESOURCES, fetchPendingResources),
    fork(editorFormSaga),
    fork(responseCreatorSaga),
  ]);
}
