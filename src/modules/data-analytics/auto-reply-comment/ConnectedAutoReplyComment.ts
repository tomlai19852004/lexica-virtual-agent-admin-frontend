import { connect } from 'react-redux';
import omit from 'lodash-es/omit';
import { AutoReplyComment } from './AutoReplyComment';
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
    chartType: state.dataAnalytics.autoReplyComment.chartType,
    chartGroup: state.dataAnalytics.autoReplyComment.chartGroup,
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
      // type: stateProps.chartType,
      group: stateProps.chartGroup,
    }),
  }),
)(AutoReplyComment as any);

export default connectedTraffic;
