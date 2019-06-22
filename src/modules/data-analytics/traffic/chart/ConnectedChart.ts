import { connect } from 'react-redux';
import { Chart } from './Chart';

const connectedChart = connect(
  (state: any) => ({
    startDate: state.dataAnalytics.dateRangePicker.startDate,
    endDate: state.dataAnalytics.dateRangePicker.endDate,
    chartType: state.dataAnalytics.traffic.chartType,
    chartGroup: state.dataAnalytics.traffic.chartGroup,
    statistics: state.dataAnalytics.traffic.statistics,
    fetchingStatistics: state.dataAnalytics.traffic.fetchingStatistics,
  }),
)(Chart);

export default connectedChart;
