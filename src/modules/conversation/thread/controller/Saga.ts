import { AnyAction } from 'redux';
import {
  all,
  apply,
  fork,
  take,
  select,
  takeLatest,
  put,
  call,
  ForkEffect,
  AllEffect,
  cancelled,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { api } from '../../../../commons/Api';
import { Pageable, SortDirection } from '../../../../commons/Page';
import { createAsyncSaga, asyncSuccessful, asyncFailure } from '../../../../commons/AsyncActions';
import { types } from './Actions';
import map from 'lodash-es/map';
import compact from 'lodash-es/compact';
import isNil from 'lodash-es/isNil';
import reduce from 'lodash-es/reduce';
import isEmpty from 'lodash-es/isEmpty';

const createMapResponseRequestAsync =
  createAsyncSaga((action: AnyAction) => apply(
    api,
    api.mapResponseToRequest,
    [
      action.payload.responses,
      action.payload.requests,
    ],
  ));

function fetchNextMessagePage(conversationId: string, multipliedPageSize: number, page: number) {
  const pageable: Pageable = {
    pageNumber: page,
    pageSize: multipliedPageSize,
    sorts: [{
      name: 'date',
      direction: SortDirection.DESC,
    }],
  };

  return apply(
    api,
    api.fetchConversationMessages,
    [
      conversationId,
      pageable,
    ],
  );
}

function* modeDistribution(action: AnyAction) {
  const { mode } = action.payload;
  switch (mode) {
    case 'label':
      yield call(createMapResponseRequestAsync, action);
      break;
  }
}

function getOccurrences(value: string, messages: any) {
  const allOccurrences = compact(map(messages, (message) => {
    if (message.body.type !== 'TEXT') {
      return undefined;
    }

    const msg = message.body.message.toLowerCase();
    const occurrences: number[][] = [];

    if (msg.indexOf(value) > -1) {
      return message.id;
    }

    return undefined;
  }));

  return allOccurrences.reverse();
}

function* fetchNextMatchMessage(
  conversationId: string,
  multipliedPageSize: number,
  terms: string,
  ignore: number = -1,
  page: number = -1,
) {
  let result;
  let hasNext = true;
  let lastPage = page;
  while (isEmpty(result) && hasNext) {
    const payload = yield fetchNextMessagePage(conversationId, multipliedPageSize, lastPage += 1);
    yield put({
      payload,
      type: types.UPDATE_SEARCH_MESSAGE,
    });
    result = getOccurrences(terms, payload.elements.slice(0, -ignore));
    hasNext = payload.hasNext;
    yield delay(100);
  }

  return result;
}

function* searchMatch(term: string) {
  const { messages, conversationId, hasNext, defaultPageSize } = yield select((state: any) => ({
    messages: state.conversation.thread.messages,
    hasNext: state.conversation.thread.hasNext,
    conversationId: state.conversation.list.selectedConversation.id,
    defaultPageSize: state.conversation.defaultPageSize,
  }));

  let result = getOccurrences(term, messages);

  if (isEmpty(result) && hasNext) {
    result = yield fetchNextMatchMessage(
      conversationId, defaultPageSize * 20, term, messages.length);
  }

  return result;
}

function* searchNotFound() {
  yield put({ type: types.SEARCH_NOT_FOUND });
  yield delay(2000);
  yield put({ type: types.RESET_NOT_STATUS });
}

function* searchHandler(action: AnyAction) {
  yield call(delay, 800);
  if (!isNil(action.payload.value) && action.payload.value.trim() !== '') {
    const value = action.payload.value.toLowerCase();

    const result = yield searchMatch(value);

    yield put({
      type: types.DONE_SEARCH,
      payload: result,
    });
    if (result.length === 0) {
      yield searchNotFound();
    }
  } else {
    yield put({
      type: types.CLEAR_SEARCH,
    });
  }
}

function* handleApplyChanges() {
  yield takeLatest(types.ASYNC_APPLY_CHANGES, modeDistribution);
}

function* handleApplyChangeResponseSuccessful() {
  while (yield take(asyncSuccessful(types.ASYNC_APPLY_CHANGES))) {
    yield call(delay, 1000);
    yield put({ type: types.DISMISS_DONE });
  }
}

function* handleApplyChangeResponseFailure() {
  while (yield take(asyncFailure(types.ASYNC_APPLY_CHANGES))) {
    yield call(delay, 2000);
    yield put({ type: types.DISMISS_DONE });
  }
}

function* handleSearch() {
  yield takeLatest(types.START_SEARCH, searchHandler);
}

function* transferTo(direction: number) {
  const { highlight, messageId, term } = yield select((state: any) => ({
    highlight: state.conversation.thread.controller.searchHighlight,
    term: state.conversation.thread.controller.searchTerm,
    messageId: state.conversation.thread.controller.highlightedMessage,
  }));
  const currIndx = highlight.indexOf(messageId);
  const nextIndx = currIndx + direction;
  const nextId = '';

  if (nextIndx >= 0) {
    if (nextIndx < highlight.length) {
      yield put({
        type: types.UPDATE_HIGHLIGHT,
        payload: highlight[nextIndx],
      });
      return;
    }

    if (nextIndx >= highlight.length) {
      yield delay(100);
      const result = yield searchMatch(term);

      yield put({
        type: types.DONE_SEARCH,
        payload: result,
      });

      if (nextIndx < result.length) {
        yield put({
          type: types.UPDATE_HIGHLIGHT,
          payload: result[nextIndx],
        });
        return;
      }
    }
  }

  yield searchNotFound();
}

function* handleTranfer() {
  yield all([
    takeLatest(types.NEXT_MATCH, transferTo, 1),
    takeLatest(types.PREV_MATCH, transferTo, -1),
  ]);
}

function* saga() {
  yield all([
    fork(handleApplyChanges),
    fork(handleApplyChangeResponseSuccessful),
    fork(handleApplyChangeResponseFailure),
    fork(handleSearch),
    fork(handleTranfer),
  ]);
}

export default saga;
