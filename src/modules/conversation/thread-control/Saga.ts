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
import { reset } from 'redux-form';
import { api } from '../../../commons/Api';
import { createAsyncSaga, asyncSuccessful } from '../../../commons/AsyncActions';
import { clearSelectedConversation, fetchInitialConversations } from '../list/Actions';
import { clearMessages } from '../thread/Actions';
import { types } from './Actions';
import { formName } from './ConnectedMessageInput';
import { saga as suggestionAnswerListener } from './suggested-answer';
import { saga as emailSenderListener } from './email-sender';

const CLOSE_CONVERSATION_ISSUE_SUCCESSFUL = asyncSuccessful(types.ASYNC_CLOSE_CONVERSATION_ISSUE);

const sendConversationMessage =
  createAsyncSaga((action: AnyAction) => apply(
    api,
    api.sendConversationMessages,
    [
      action.conversation.id,
      action.message,
    ],
  ));

const closeConversationIssue =
  createAsyncSaga((action: AnyAction) => apply(
    api,
    api.closeConversation,
    [
      action.conversation.id,
    ],
  ));

function* sendConversationMessagesListener() {
  yield takeLatest(types.ASYNC_SEND_CONVERSATION_MESSAGE, sendConversationMessage);
}

function* closeConversationIssueListener() {
  yield takeLatest(types.ASYNC_CLOSE_CONVERSATION_ISSUE, closeConversationIssue);
}

function* closeConversationSuccessfulListener() {
  yield takeLatest(CLOSE_CONVERSATION_ISSUE_SUCCESSFUL, function* () {
    const { status, defaultPageSize, query } = yield select(
      (state: any) => ({
        status: state.conversation.list.conversationStatus,
        defaultPageSize: state.conversation.defaultPageSize,
        query: state.conversation.list.searchTerm,
      }),
  );
    yield put(clearSelectedConversation());
    yield put(clearMessages());
    yield put(fetchInitialConversations(status, defaultPageSize, query));
  });
}

function* clearFormDataListener() {
  const type = asyncSuccessful(types.ASYNC_SEND_CONVERSATION_MESSAGE);
  yield takeLatest(type, function* () {
    yield put(reset(formName));
  });
}

function* saga() {
  yield all([
    fork(sendConversationMessagesListener),
    fork(clearFormDataListener),
    fork(closeConversationIssueListener),
    fork(closeConversationSuccessfulListener),
    fork(suggestionAnswerListener),
    fork(emailSenderListener),
  ]);
}

export default saga;
