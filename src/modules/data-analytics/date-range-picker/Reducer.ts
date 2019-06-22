import { combineReducers, AnyAction } from 'redux';
import * as moment from 'moment';
import { types } from './Actions';

const defaultStartDate = moment().utc().startOf('day').subtract(7, 'days');
const defaultEndDate = moment().utc().endOf('day');

const startDate = (state = defaultStartDate, action: AnyAction) => {
  switch (action.type) {
    case types.ON_DATE_CHANGE:
      return action.payload.startDate.utc().startOf('day');
    default:
      return state;
  }
};

const endDate = (state = defaultEndDate, action: AnyAction) => {
  switch (action.type) {
    case types.ON_DATE_CHANGE:
      return action.payload.endDate === null
        ? action.payload.startDate.utc().endOf('day')
        : action.payload.endDate.utc().endOf('day');
    default:
      return state;
  }
};

const focusedInput = (state = null, action: AnyAction) => {
  switch (action.type) {
    case types.ON_FOCUS_CHANGE:
      return action.payload.input;
    default:
      return state;
  }
};

export default combineReducers({
  startDate,
  endDate,
  focusedInput,
});
