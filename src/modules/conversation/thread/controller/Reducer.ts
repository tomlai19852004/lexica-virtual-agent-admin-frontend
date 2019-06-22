import { combineReducers, AnyAction } from 'redux';
import without from 'lodash-es/without';
import concat from 'lodash-es/concat';
import defaults from 'lodash-es/defaults';
import get from 'lodash-es/get';
import { asyncSuccessful, asyncFetching, asyncFailure } from '../../../../commons/AsyncActions';
import { types } from './Actions';
import { types as listTypes } from '../../list/Actions';

const APPLY_CHANGES_SUCCESSFUL = asyncSuccessful(types.ASYNC_APPLY_CHANGES);
const APPLY_CHANGES_FETCHING = asyncFetching(types.ASYNC_APPLY_CHANGES);
const APPLY_CHANGES_FAILURE = asyncFailure(types.ASYNC_APPLY_CHANGES);

const mode = (mode: string = '', action: AnyAction) => {
  switch (action.type) {
    case types.TOGGLE_MODE:
      if (action.payload.mode === mode) {
        return '';
      }
      return action.payload.mode;
    default:
      return mode;
  }
};

export enum Status {
  DISMISS = 0,
  SUCCESS = 1,
  LOADING = 2,
  FAILURE = 3,
}

const status = (status: Status = Status.DISMISS, action: AnyAction) => {
  switch (action.type) {
    case APPLY_CHANGES_SUCCESSFUL:
      return Status.SUCCESS;
    case APPLY_CHANGES_FETCHING:
      return Status.LOADING;
    case APPLY_CHANGES_FAILURE:
      return Status.FAILURE;
    case types.DISMISS_DONE:
      return Status.DISMISS;
    default:
      return status;
  }
};

const selectedMessages = (
  messages: { [key: string]: string[] } = { REQUEST: [], RESPONSE: [] },
  action: AnyAction,
) => {
  switch (action.type) {
    case types.SELECT_MESSAGE:
      const type = action.payload.message.type;
      const messageArr = messages[type];
      if (messageArr.indexOf(action.payload.message) > -1) {
        return Object.assign({}, messages, { [type]: without(messageArr, action.payload.message) });
      }
      return Object.assign({}, messages, { [type]: concat(messageArr, action.payload.message) });
    case listTypes.SELECT_CONVERSATION:
    case types.CLEAR_MESSAGE_SELECTIONS:
    case APPLY_CHANGES_SUCCESSFUL:
    case types.TOGGLE_MODE:
      return { REQUEST: [], RESPONSE: [] };
    default:
      return messages;
  }
};

const searchHighlight = (
  highlight: string[] = [],
  action: AnyAction,
) => {
  switch (action.type) {
    case listTypes.SELECT_CONVERSATION:
    case types.CLEAR_SEARCH:
      return [];
    case types.DONE_SEARCH:
      return action.payload;
    default:
      return highlight;
  }
};

const searchDone = (status = true, action: AnyAction) => {
  switch (action.type) {
    case types.START_SEARCH:
      return false;
    case types.DONE_SEARCH:
      return true;
    default:
      return status;
  }
};

const searchNotFound = (status = false, action: AnyAction) => {
  switch (action.type) {
    case types.SEARCH_NOT_FOUND:
      return true;
    case types.RESET_NOT_STATUS:
      return false;
    default:
      return status;
  }
};

const searchTerm = (terms: string = '', action: AnyAction) => {
  switch (action.type) {
    case types.START_SEARCH:
      return action.payload.value;
    case listTypes.SELECT_CONVERSATION:
    case types.CLEAR_SEARCH:
      return '';
    default:
      return terms;
  }
};

const highlightedMessage = (id: string = '', action: AnyAction) => {
  switch (action.type) {
    case types.UPDATE_HIGHLIGHT:
      return action.payload;
    case types.DONE_SEARCH:
      if (action.payload.length > 0) {
        return action.payload[0];
      }
    case types.CLEAR_SEARCH:
    case listTypes.SELECT_CONVERSATION:
      return '';
    default:
      return id;
  }
};

export default combineReducers({
  mode,
  status,
  selectedMessages,
  searchHighlight,
  searchDone,
  searchNotFound,
  searchTerm,
  highlightedMessage,
});
