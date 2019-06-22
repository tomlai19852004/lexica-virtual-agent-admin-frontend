import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import { Moment } from 'moment';
import { onDatesChange, onFocusChange } from './Actions';
import 'react-dates/lib/css/_datepicker.css';

const options = {
  isOutsideRange: ((day: any) => false) as any,
  hideKeyboardShortcutsPanel: true,
  minimumNights: 0,
  displayFormat: 'DD MMM YYYY',
  startDatePlaceholderText: 'Start',
  endDatePlaceholderText: 'End',
};

const connectedDateRangePicker = connect<any, any, any>(
  (state: any) => ({
    ...options,
    startDate: state.dataAnalytics.dateRangePicker.startDate,
    endDate: state.dataAnalytics.dateRangePicker.endDate,
    focusedInput: state.dataAnalytics.dateRangePicker.focusedInput,
  }),
  {
    onDatesChange,
    onFocusChange,
  },
)(DateRangePicker);

export default connectedDateRangePicker;
