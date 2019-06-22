import { all, fork, ForkEffect, AllEffect } from 'redux-saga/effects';
import { saga as list } from './list';
import { saga as thread } from './thread';
import { saga as threadControl } from './thread-control';

function* saga() {
  yield all([
    fork(list),
    fork(thread),
    fork(threadControl),
  ]);
}

export default saga;
