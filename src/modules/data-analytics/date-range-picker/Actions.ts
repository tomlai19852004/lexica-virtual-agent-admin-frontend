import { Moment } from 'moment';

const types = {
  ON_DATE_CHANGE: 'DATA_ANALYTICS:DATE_RANGE_PICKER:ON_DATE_CHANGE',
  ON_FOCUS_CHANGE: 'DATA_ANALYTICS:DATE_RANGE_PICKER:ON_FOCUS_CHANGE',
};

const onDatesChange = (payload: {startDate: Moment, endDate: Moment }) => ({
  payload,
  type: types.ON_DATE_CHANGE,
});

const onFocusChange = (input: any) => ({
  type: types.ON_FOCUS_CHANGE,
  payload: {
    input,
  },
});

export {
  types,
  onDatesChange,
  onFocusChange,
};
