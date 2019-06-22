import { combineReducers, AnyAction } from 'redux';
import { types } from './Actions';
import { asyncFetching, asyncSuccessful } from '../../../../commons/AsyncActions';

const SUBMIT_REVIEW_FETCHING = asyncFetching(types.ASYNC_SUBMIT_REVIEW);
const SUBMIT_REVIEW_SUCCESSFUL = asyncSuccessful(types.ASYNC_SUBMIT_REVIEW);

const index = (id: number | null = null, action: AnyAction) => {
  switch (action.type) {
    case types.OPEN_RATING:
      return action.payload.messageInd;
    case types.CLOSE_RATING:
    case SUBMIT_REVIEW_SUCCESSFUL:
      return null;
    default:
      return id;
  }
};

const loading = (status: boolean = false, action: AnyAction) => {
  switch (action.type) {
    case SUBMIT_REVIEW_FETCHING:
      return true;
    case SUBMIT_REVIEW_SUCCESSFUL:
      return false;
    default:
      return status;
  }
};

export default combineReducers({
  index,
  loading,
});
