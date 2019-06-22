import { connect } from 'react-redux';
import omit from 'lodash-es/omit';
import { Traffic } from './Traffic';
import {
  changeGroup,
  changeType,
  fetchStatistics,
  switchFetchStatisticsListener,
} from './Actions';

const connectedTraffic = connect<any, any, any, any>(
  (state: any) => ({
    startDate: state.dataAnalytics.dateRangePicker.startDate,
    endDate: state.dataAnalytics.dateRangePicker.endDate,
    chartType: state.dataAnalytics.traffic.chartType,
    chartGroup: state.dataAnalytics.traffic.chartGroup,
  }),
  {
    changeGroup,
    changeType,
    fetchStatistics,
    switchFetchStatisticsListener,
  },
  (stateProps, dispatchProps, ownProps) => ({
    ...omit(stateProps, 'startDate', 'endDate'),
    ...dispatchProps,
    fetchStatistics: dispatchProps.fetchStatistics.bind(null, {
      start: stateProps.startDate,
      end: stateProps.endDate,
      type: stateProps.chartType,
      group: stateProps.chartGroup,
    }),
  }),
)(Traffic as any);

export default connectedTraffic;
