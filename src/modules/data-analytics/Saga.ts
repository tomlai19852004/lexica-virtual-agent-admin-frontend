import { all, fork, ForkEffect, AllEffect } from 'redux-saga/effects';
import { saga as traffic } from './traffic';
import { saga as autoReplyComment } from './auto-reply-comment';

function* saga() {
  yield all([
    fork(traffic),
    fork(autoReplyComment),
  ]);
}

export default saga;
