import { AnyAction } from 'redux';
import { isNil } from 'lodash';
import {
  all,
  apply,
  call,
  cancel,
  fork,
  put,
  take,
  select,
  takeLatest,
  ForkEffect,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { api } from '../../../commons/Api';
import { createAsyncSaga } from '../../../commons/AsyncActions';
import {
  types,
  fetchInitialConversations,
  conversationSeen,
  clearSelectedConversation,
  fetchFirstConversationPage,
} from './Actions';
import { Pageable } from '../../../commons/Page';

// async fn
const asyncFetchConversationPageSaga =
  createAsyncSaga((action: AnyAction) =>
    apply(
      api,
      api.fetchConversations,
      [
        action.payload.status,
        action.payload.query,
        {
          pageNumber: action.payload.pageNumber,
          pageSize: action.payload.pageSize,
          sorts: [{
            name: 'lastUpdatedDate',
            direction: 'desc',
          }],
        } as Pageable,
      ],
    ),
  );

const asyncConversationSeen =
  createAsyncSaga((action: AnyAction) => apply(
    api,
    api.seenConversation,
    [
      action.payload.conversation.id,
    ],
  ));
// end of async fn

// state change listener
function* selectConversationListener() {
  yield takeLatest(types.SELECT_CONVERSATION, function* (action: AnyAction) {
    yield put(conversationSeen(action.conversation));
  });
}

function* conversationSeenListener() {
  yield takeLatest(types.ASYNC_CONVERSATION_SEEN, asyncConversationSeen);
}

function* updateConversationStatusListener() {
  yield takeLatest(types.UPDATE_CONVERSATION_STATUS, function* (action: AnyAction) {
    const { defaultPageSize, query } = yield select(
      (state: any) => ({
        defaultPageSize: state.conversation.defaultPageSize,
        query: state.conversation.list.searchTerm,
      }),
    );
    yield put(fetchInitialConversations(action.payload.status, defaultPageSize, query));
    yield put(clearSelectedConversation());
  });
}

function* searchConversations() {
  yield takeLatest(types.UPDATE_SEARCH_TERM, function* (action: AnyAction) {
    yield call(delay, 300);
    yield fork(syncConversationTimer);
  });
}
// end of state change listener

// fetch conversation listener
function* fetchInitialConversationListener() {
  yield takeLatest(types.ASYNC_FETCH_CONVERSATIONS, asyncFetchConversationPageSaga);
}

function* fetchFirstConversationPageListener() {
  yield takeLatest(types.ASYNC_FETCH_FIRST_CONVERSATIONS_PAGE, asyncFetchConversationPageSaga);
}

function* fetchNextConversationPageListener() {
  yield takeLatest(types.ASYNC_FETCH_NEXT_CONVERSATION_PAGE, asyncFetchConversationPageSaga);
}
// end of fetch conversation listener

// fetch page sage
function* triggerFetchInitialConversations() {
  const { status, defaultPageSize, query } = yield select(
    (state: any) => ({
      status: state.conversation.list.conversationStatus,
      defaultPageSize: state.conversation.defaultPageSize,
      query: state.conversation.list.searchTerm,
    }),
  );
  yield put(fetchInitialConversations(status, defaultPageSize, query));
}
// end of fetch page sage

// initialization of conversation list
function* conversationSyncFlowListener() {
  while (yield take(types.START_CONVERSATION_SYNC)) {
    const syncConv = yield fork(syncConversationTimer);
    yield fork(triggerFetchInitialConversations);
    yield take(types.STOP_CONVERSATION_SYNC);
    yield cancel(syncConv);
  }
}

function* syncConversationTimer() {
  while (true) {
    yield fork(syncConversation);
    yield call(delay, 500000);
  }
}

function* syncConversation() {
  const { status, defaultPageSize, query } = yield select(
      (state: any) => ({
        status: state.conversation.list.conversationStatus,
        defaultPageSize: state.conversation.defaultPageSize,
        query: state.conversation.list.searchTerm,
      }),
    );
  yield put(fetchFirstConversationPage(status, defaultPageSize, query));
}
// end of initialization of conversation list

function* saga() {
  yield all([
    fork(fetchInitialConversationListener),
    fork(fetchFirstConversationPageListener),
    fork(fetchNextConversationPageListener),
    fork(conversationSeenListener),
    fork(conversationSyncFlowListener),
    fork(selectConversationListener),
    fork(updateConversationStatusListener),
    fork(searchConversations),
  ]);
}

export default saga;
