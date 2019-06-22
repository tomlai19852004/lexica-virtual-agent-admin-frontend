import { combineReducers, AnyAction, Reducer } from 'redux';
import {
  unionBy,
  countBy,
  assignWith,
  partialRight,
  isNil,
  differenceBy,
  sortBy,
  orderBy,
 } from 'lodash';
import { types } from './Actions';
import { asyncSuccessful, asyncFetching } from '../../../commons/AsyncActions';
import { ConversationStatus } from '../../../commons/Constants';

const FETCH_CONVERSATIONS_SUCCESSFUL =
  asyncSuccessful(types.ASYNC_FETCH_CONVERSATIONS);
const FETCH_NEXT_CONVERSATION_PAGE_FETCHING =
  asyncFetching(types.ASYNC_FETCH_NEXT_CONVERSATION_PAGE);
const FETCH_NEXT_CONVERSATION_PAGE_SUCCESSFUL =
  asyncSuccessful(types.ASYNC_FETCH_NEXT_CONVERSATION_PAGE);
const FETCH_FIRST_PAGE_CONVERSATIONS_SUCCESSFUL =
 asyncSuccessful(types.ASYNC_FETCH_FIRST_CONVERSATIONS_PAGE);

const conversations = (status = [], action: AnyAction) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS_SUCCESSFUL:
      return action.payload.elements;
    case FETCH_FIRST_PAGE_CONVERSATIONS_SUCCESSFUL:
      return orderBy(
        unionBy(action.payload.elements, status, 'id'),
        ['lastUpdatedDate'],
        ['desc'],
      );
    case FETCH_NEXT_CONVERSATION_PAGE_SUCCESSFUL:
      return unionBy(status, action.payload.elements, 'id');
    default:
      return status;
  }
};

const selectedConversation = (status = '', action: AnyAction) => {
  switch (action.type) {
    case types.SELECT_CONVERSATION:
      return action.conversation;
    case types.CLEAR_SELECTED_CONVERSATION:
      return {};
    default:
      return status;
  }
};

const totalElements = (status = 0, action: AnyAction) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS_SUCCESSFUL:
    case FETCH_FIRST_PAGE_CONVERSATIONS_SUCCESSFUL:
    case FETCH_NEXT_CONVERSATION_PAGE_SUCCESSFUL:
      return action.payload.totalElements;
    default:
      return status;
  }
};

const conversationStatus = (status = ConversationStatus.OPEN, action: AnyAction) => {
  switch (action.type) {
    case types.UPDATE_CONVERSATION_STATUS:
      return action.payload.status;
    default:
      return status;
  }
};

const searchTerm = (status = '', action: AnyAction) => {
  switch (action.type) {
    case types.UPDATE_SEARCH_TERM:
      return action.payload.status;
    default:
      return status;
  }
};

const conversationLoading = (status = false, action: AnyAction) => {
  switch (action.type) {
    case FETCH_NEXT_CONVERSATION_PAGE_SUCCESSFUL:
      return false;
    case FETCH_NEXT_CONVERSATION_PAGE_FETCHING:
      return true;
    default:
      return status;
  }
};

// interface sizes {
//   [key: string]: number;
// }

// const increaseSizes: ({ }, oldSize: sizes, incoming: sizes) => sizes =
//   partialRight(assignWith, (objValue: number, srcValue: number) =>
//     isNil(objValue) ? objValue : objValue + srcValue);

// const combineSizes: ({ }, oldSize: sizes, incoming: sizes) => sizes =
//   partialRight(assignWith, (objValue: number, srcValue: number) =>
//     isNil(objValue) ? srcValue : Math.max(objValue, srcValue));

const hasNext = (status = false, action: AnyAction) => {
  switch (action.type) {
    case FETCH_CONVERSATIONS_SUCCESSFUL:
    case FETCH_NEXT_CONVERSATION_PAGE_SUCCESSFUL:
      return action.payload.hasNext;
    default:
      return status;
  }
};

const lastPage = (page = 0, action: AnyAction) => {
  let lastPage = page;
  switch (action.type) {
    case FETCH_NEXT_CONVERSATION_PAGE_SUCCESSFUL:
      return lastPage += 1;
    case types.UPDATE_CONVERSATION_STATUS:
      return lastPage = 0;
    default:
      return lastPage;
  }
};

export default combineReducers({
  conversations,
  totalElements,
  selectedConversation,
  conversationStatus,
  searchTerm,
  conversationLoading,
  hasNext,
  lastPage,
});
