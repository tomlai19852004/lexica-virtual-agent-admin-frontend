import { combineReducers, AnyAction } from 'redux';
import { asyncSuccessful, asyncFetching, asyncFailure } from '../../../commons/AsyncActions';
import { types } from './Actions';
import { ChartGroup, ChartType } from './Constants';

const fetchStatisticsFetching = asyncFetching(types.ASYNC_FETCH_STATISTICS);
const fetchStatisticsSuccessful = asyncSuccessful(types.ASYNC_FETCH_STATISTICS);
const fetchStatisticsFailure = asyncFailure(types.ASYNC_FETCH_STATISTICS);

const chartType = (state = ChartType.RATING, action: AnyAction) => {
  switch (action.type) {
    case types.CHANGE_TYPE:
      return action.payload.type;
    default:
      return state;
  }
};

const chartGroup = (state = ChartGroup.DAY, action: AnyAction) => {
  switch (action.type) {
    case types.CHANGE_GROUP:
      return action.payload.group;
    default:
      return state;
  }
};

const fetchStatisticsListener = (state = false, action: AnyAction) => {
  switch (action.type) {
    case types.SWITCH_FETCH_STATISTIC_LISTENER:
      return action.payload.state;
    default:
      return state;
  }
};

const statistics = (state = [], action: AnyAction) => {
  switch (action.type) {
    case fetchStatisticsSuccessful:
      return action.payload;
    default:
      return state;
  }
};

const fetchingStatistics = (state = false, action: AnyAction) => {
  switch (action.type) {
    case fetchStatisticsFetching:
      return true;
    case fetchStatisticsSuccessful:
    case fetchStatisticsFailure:
      return false;
    default:
      return state;
  }
};

export default combineReducers({
  chartType,
  chartGroup,
  fetchStatisticsListener,
  statistics,
  fetchingStatistics,
});
