import { connect } from 'react-redux';
import { Chart } from './Chart';

const connectedChart = connect(
  (state: any) => ({
    startDate: state.dataAnalytics.dateRangePicker.startDate,
    endDate: state.dataAnalytics.dateRangePicker.endDate,
    chartGroup: state.dataAnalytics.autoReplyComment.chartGroup,
    chartType: state.dataAnalytics.autoReplyComment.chartType,
    statistics: state.dataAnalytics.autoReplyComment.statistics,
    fetchingStatistics: state.dataAnalytics.autoReplyComment.fetchingStatistics,
  }),
)(Chart);

export default connectedChart;
