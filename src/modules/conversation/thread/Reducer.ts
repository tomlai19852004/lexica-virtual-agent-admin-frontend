import { combineReducers, AnyAction } from 'redux';
import { types } from './Actions';
import { types as listTypes } from '../list/Actions';
import { types as controllerTypes } from './controller/Actions';
import { asyncSuccessful, asyncFetching } from '../../../commons/AsyncActions';
import { reducer as controller } from './controller';
import { reducer as messageInput } from '../thread-control';
import { reducer as rating } from './rating';
import { types as ratingTypes } from './rating/Actions';
import unionBy from 'lodash-es/unionBy';
import findIndex from 'lodash-es/findIndex';

const FETCH_MESSAGES_SUCCESSFUL = asyncSuccessful(types.ASYNC_FETCH_INITIAL_MESSAGES);
const FETCH_FIRST_MESSAGE_PAGE_SUCCESSFUL =
  asyncSuccessful(types.ASYNC_FETCH_FIRST_MESSAGE_PAGE);
const FETCH_NEXT_MESSAGE_PAGE_SUCCESSFUL =
  asyncSuccessful(types.ASYNC_FETCH_NEXT_MESSAGE_PAGE);
const FETCH_NEXT_MESSAGE_PAGE_FETCHING =
  asyncFetching(types.ASYNC_FETCH_NEXT_MESSAGE_PAGE);
const SUBMIT_REVIEW_SUCCESSFUL = asyncSuccessful(ratingTypes.ASYNC_SUBMIT_REVIEW);

const messages = (state = [], action: AnyAction) => {
  switch (action.type) {
    case FETCH_MESSAGES_SUCCESSFUL:
      return action.payload.elements.reverse();
    case FETCH_FIRST_MESSAGE_PAGE_SUCCESSFUL:
      return unionBy(state, action.payload.elements.reverse(), 'id');
    case FETCH_NEXT_MESSAGE_PAGE_SUCCESSFUL:
    case controllerTypes.UPDATE_SEARCH_MESSAGE:
      return unionBy(action.payload.elements.reverse(), state, 'id');
    case SUBMIT_REVIEW_SUCCESSFUL:
      const newState: any[] = state.slice();
      const index = findIndex(state, ['id', action.payload.id]);
      newState[index] = action.payload;
      return newState;
    case types.CLEAR_MESSAGES:
      return [];
    default:
      return state;
  }
};

const loading = (state = false, action: AnyAction) => {
  switch (action.type) {
    case FETCH_NEXT_MESSAGE_PAGE_FETCHING:
      return true;
    case FETCH_NEXT_MESSAGE_PAGE_SUCCESSFUL:
      return false;
    default:
      return state;
  }
};

const hasNext = (state = false, action: AnyAction) => {
  switch (action.type) {
    case FETCH_MESSAGES_SUCCESSFUL:
    case FETCH_NEXT_MESSAGE_PAGE_SUCCESSFUL:
    case controllerTypes.UPDATE_SEARCH_MESSAGE:
      return action.payload.hasNext;
    default:
      return state;
  }
};

const lastPage = (page = 0, action: AnyAction) => {
  let lastPage = page;
  switch (action.type) {
    case FETCH_NEXT_MESSAGE_PAGE_SUCCESSFUL:
      return lastPage += 1;
    case listTypes.SELECT_CONVERSATION:
      return 0;
    case controllerTypes.UPDATE_SEARCH_MESSAGE:
      return lastPage += action.payload.elements.lenght / action.payload.pageSzie - 1;
    default:
      return lastPage;
  }
};

export default combineReducers({
  messages,
  loading,
  controller,
  messageInput,
  rating,
  hasNext,
  lastPage,
});
