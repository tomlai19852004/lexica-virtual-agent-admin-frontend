import { AnyAction } from 'redux';
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
import { api } from '../../../commons/Api';
import { createAsyncSaga } from '../../../commons/AsyncActions';
import { actions as dateRangePickerActions } from '../date-range-picker';
import * as actions from './Actions';

const fetchAutoReplyCommentStatistics =
  createAsyncSaga((action: AnyAction) => apply(
    api, api.fetchAutoReplyCommentStatistics, [action.payload.parameters]));

function* fetchAutoReplyCommentStatisticsListener() {
  yield takeLatest(actions.types.ASYNC_FETCH_STATISTICS, fetchAutoReplyCommentStatistics);
}

function* componentStateListener() {
  yield takeLatest(
    [
      dateRangePickerActions.types.ON_DATE_CHANGE,
      actions.types.CHANGE_GROUP,
      actions.types.CHANGE_TYPE,
    ],
    function* (action: AnyAction) {
      const fetchStatisticsListener = yield select(
        (state: any) => state.dataAnalytics.autoReplyComment.fetchStatisticsListener,
      );
      if (fetchStatisticsListener) {
        const parameters = yield select((state: any) => ({
          start: state.dataAnalytics.dateRangePicker.startDate,
          end: state.dataAnalytics.dateRangePicker.endDate,
          // type: state.dataAnalytics.autoReplyComment.chartType,
          group: state.dataAnalytics.autoReplyComment.chartGroup,
        }));
        yield put(actions.fetchStatistics(parameters));
      }
    },
  );
}

function* saga() {
  yield all([
    fork(fetchAutoReplyCommentStatisticsListener),
    fork(componentStateListener),
  ]);
}

export default saga;
