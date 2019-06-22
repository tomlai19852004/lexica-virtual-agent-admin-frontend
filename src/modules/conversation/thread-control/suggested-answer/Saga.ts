import { AnyAction } from 'redux';
import { takeLatest, all, apply, put, select } from 'redux-saga/effects';
import { change } from 'redux-form';

import { createAsyncSaga } from '../../../../commons/AsyncActions';
import { types, fetchSuggestion } from './Action';
import { types as threadTypes } from '../../thread/Actions';
import { api } from '../../../../commons/Api';
import { formName } from '../ConnectedMessageInput';
import { holdUnsentMessage } from '../Actions';

const fetchSuggestions =
  createAsyncSaga(action => apply(
    api,
    api.fetchSuggestions,
    [
      action.payload.msg,
      action.payload.msgId,
    ]));

const trackSuggestedAnswerClick =
  createAsyncSaga(action => apply(
    api,
    api.clickConversationSuggestedAnswer,
    [
      action.payload.conversationId,
    ]));

export default function* saga() {
  yield all([
    takeLatest(types.ASYNC_FETCHING_SUGGESTION, fetchSuggestions),
    takeLatest(types.SELECT_SUGGESTION, function* (action: any) {
      // fill in messageInput with suggested answer
      yield put(change(formName, 'message', action.payload.msg));
      // send the content of suggested answer to state..unsentMessages
      const conversationId = yield select(
        (state: any) => state.conversation.list.selectedConversation.id,
      );
      yield put(holdUnsentMessage(action.payload.msg, conversationId));
      yield trackSuggestedAnswerClick({
        type: types.SELECT_SUGGESTION,
        payload: {
          conversationId,
        },
      });
    }),
  ]);
}
