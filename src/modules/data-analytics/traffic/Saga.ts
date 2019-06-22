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

const fetchTrafficStatistics =
  createAsyncSaga((action: AnyAction) => apply(
    api, api.fetchTrafficStatistics, [action.payload.parameters]));

function* fetchTrafficStatisticsListener() {
  yield takeLatest(actions.types.ASYNC_FETCH_STATISTICS, fetchTrafficStatistics);
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
        (state: any) => state.dataAnalytics.traffic.fetchStatisticsListener,
      );
      if (fetchStatisticsListener) {
        const parameters = yield select((state: any) => ({
          start: state.dataAnalytics.dateRangePicker.startDate,
          end: state.dataAnalytics.dateRangePicker.endDate,
          type: state.dataAnalytics.traffic.chartType,
          group: state.dataAnalytics.traffic.chartGroup,
        }));
        yield put(actions.fetchStatistics(parameters));
      }
    },
  );
}

function* saga() {
  yield all([
    fork(fetchTrafficStatisticsListener),
    fork(componentStateListener),
  ]);
}

export default saga;
