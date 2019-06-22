import { all, fork, AllEffect, ForkEffect } from 'redux-saga/effects';
import { saga as loginFromSage } from './login-form';

export default function* sage() {
  yield all([
    fork(loginFromSage),
  ]);
}
