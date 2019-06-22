import { all, fork, takeEvery } from 'redux-saga/effects';
import { saga as frameSaga } from '../modules/frame';
import { saga as conversationSaga } from '../modules/conversation';
import { saga as loginSage } from '../modules/login';
import { saga as resourcesSaga } from '../modules/intent-editor';
import { saga as dataAnalytics } from '../modules/data-analytics';

function* root(): any {
  yield all([
    fork(frameSaga),
    fork(conversationSaga),
    fork(loginSage),
    fork(resourcesSaga),
    fork(dataAnalytics),
  ]);
}

export { root };
