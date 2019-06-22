import { isNil } from 'lodash';
import { AnyAction } from 'redux';
import {
  all,
  apply,
  call,
  cancel,
  fork,
  select,
  take,
  takeLatest,
  put,
  ForkEffect,
  AllEffect,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { api } from '../../../commons/Api';
import { createAsyncSaga, asyncSuccessful } from '../../../commons/AsyncActions';
import { types as issueListActionTypes } from '../list/Actions';
import { types as messageListActionTypes } from '../thread-control/Actions';
import {
  types,
  clearMessages,
  fetchInitialMessages,
  fetchFirstMessagePage,
  fetchNextMessagePage,
} from './Actions';
import { saga as messageControllerListener } from './controller';
import { saga as ratingListener } from './rating';
import { Pageable } from '../../../commons/Page';

// async fn
const asyncFetchMessagePageSaga =
  createAsyncSaga((action: AnyAction) =>
    apply(
      api,
      api.fetchConversationMessages,
      [
        action.payload.conversation.id,
        {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          sorts: [{
            name: 'date',
            direction: 'desc',
          }],
        } as Pageable,
      ]));

const createMapResponseRequestAsync =
  createAsyncSaga((action: AnyAction) => apply(
    api,
    api.mapResponseToRequest,
    [
      action.payload.responses,
      action.payload.requests,
    ],
  ));
// end of async fn

// fetch message listener
function* fetchInitialMessagesListener() {
  const FETCH_FIRST_PAGE_FOR_INIT = types.ASYNC_FETCH_INITIAL_MESSAGES;
  yield takeLatest(FETCH_FIRST_PAGE_FOR_INIT, asyncFetchMessagePageSaga);
}

function* fetchFirstMessagePageListener() {
  const FETCH_FIRST_PAGE_FOR_SYNC = types.ASYNC_FETCH_FIRST_MESSAGE_PAGE;
  yield takeLatest(FETCH_FIRST_PAGE_FOR_SYNC, asyncFetchMessagePageSaga);
}

function* fetchNextMessagePageListener() {
  const FETCH_NEXT_PAGE = types.ASYNC_FETCH_NEXT_MESSAGE_PAGE;
  yield takeLatest(FETCH_NEXT_PAGE, asyncFetchMessagePageSaga);
}
// end of fetch message listener

// fetch page saga
function* triggerFetchFirstMessagePage() {
  const { conversation, defaultPageSize } = yield select(
    (state: any) => ({
      conversation: state.conversation.list.selectedConversation,
      defaultPageSize: state.conversation.defaultPageSize,
    }),
  );
  const pageNumber = 0;
  yield put(fetchFirstMessagePage(
      conversation,
      defaultPageSize,
      pageNumber,
    ));
}
// end of fetch page sage

// state change listener
function* sendMessageSuccessfulListener() {
  const type = asyncSuccessful(messageListActionTypes.ASYNC_SEND_CONVERSATION_MESSAGE);
  yield takeLatest(type, triggerFetchFirstMessagePage);
}

function* conversationSelectedListener() {
  yield takeLatest(issueListActionTypes.SELECT_CONVERSATION, function* (action: AnyAction) {
    const { conversation, defaultPageSize } = yield select(
      (state: any) => ({
        conversation: state.conversation.list.selectedConversation,
        defaultPageSize: state.conversation.defaultPageSize,
      }),
    );
    // yield put(clearMessages());
    yield put(fetchInitialMessages(
      conversation,
      defaultPageSize,
      0,
    ));
  });
}
// end of state change listener

// sync Message
function* syncMessages() {
  while (true) {
    const { conversation, loading } = yield select(
      (state: any) => ({
        conversation: state.conversation.list.selectedConversation,
        loading: state.conversation.thread.loading,
      }),
    );
    if (conversation.id && !loading) {
      yield fork(triggerFetchFirstMessagePage);
    }
    yield call(delay, 500000);
  }
}

function* messageSyncFlowListener() {
  while (yield take(types.START_MESSAGES_SYNC)) {
    const task = yield fork(syncMessages);
    yield take(types.STOP_MESSAGES_SYNC);
    yield cancel(task);
  }
}
// end of sync message

function* saga() {
  yield all([
    fork(conversationSelectedListener),
    fork(fetchInitialMessagesListener),
    fork(fetchFirstMessagePageListener),
    fork(fetchNextMessagePageListener),
    fork(sendMessageSuccessfulListener),
    fork(messageSyncFlowListener),
    fork(messageControllerListener),
    fork(ratingListener),
  ]);
}

export default saga;
