import { Moment } from 'moment';
import { ChartGroup, ChartType } from './Constants';

const types = {
  ASYNC_FETCH_STATISTICS: 'DATA_ANALYTICS:AUTO_REPLY_COMMENT:FETCH_STATISTICS.ASYNC',
  CHANGE_GROUP: 'DATA_ANALYTICS:AUTO_REPLY_COMMENT:CHANGE_GROUP',
  CHANGE_TYPE: 'DATA_ANALYTICS:AUTO_REPLY_COMMENT:CHANGE_TYPE',
  SWITCH_FETCH_STATISTIC_LISTENER:
    'DATA_ANALYTICS:AUTO_REPLY_COMMENT:SWITCH_FETCH_STATISTIC_LISTENER',
};

const fetchStatistics = (parameters: {
  start: Moment,
  end: Moment,
  type: string,
  group: string,
}) => ({
  type: types.ASYNC_FETCH_STATISTICS,
  payload: {
    parameters,
  },
});

const changeGroup = (group: ChartGroup) => ({
  type: types.CHANGE_GROUP,
  payload: {
    group,
  },
});

const changeType = (type: ChartType) => ({
  type: types.CHANGE_TYPE,
  payload: {
    type,
  },
});

const switchFetchStatisticsListener = (state: boolean) => ({
  type: types.SWITCH_FETCH_STATISTIC_LISTENER,
  payload: {
    state,
  },
});

export {
  types,
  fetchStatistics,
  changeGroup,
  changeType,
  switchFetchStatisticsListener,
};
