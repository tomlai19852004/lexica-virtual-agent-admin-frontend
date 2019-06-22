import { connect } from 'react-redux';
import { MessageListProps, MessageList } from './MessageList';
import {
  startMessagesSync,
  stopMessagesSync,
  fetchNextMessagePage,
} from './Actions';
import {
  selectSuggestion,
  fetchSuggestion,
  openSuggestSelector,
  turnOffStatusLoading,
} from '../thread-control/suggested-answer/Action';
import { selectMessage } from './controller/Actions';
import { openRating } from './rating/Actions';

const connectedMessageList = connect(
  (state: any) => ({
    conversations: state.conversation.list.conversations,
    selectedConversation: state.conversation.list.selectedConversation,
    totalConversation: state.conversation.list.totalElements,
    messages: state.conversation.thread.messages,
    loading: state.conversation.thread.loading,
    selectedMessages: state.conversation.thread.controller.selectedMessages,
    mode: state.conversation.thread.controller.mode,
    suggestions: state.conversation.suggest.suggestions,
    hasNext: state.conversation.thread.hasNext,
    defaultPageSize: state.conversation.defaultPageSize,
    nextPage: state.conversation.thread.lastPage + 1,
    highlightedId: state.conversation.thread.controller.highlightedMessage,
    highlightedMessage: state.conversation.thread.controller.searchHighlight,
    searchTerm: state.conversation.thread.controller.searchTerm,
    searchDone: state.conversation.thread.controller.searchDone,
  }),
  {
    startMessagesSync,
    stopMessagesSync,
    fetchSuggestion,
    fetchNextMessagePage,
    selectMessage,
    openRating,
    selectSuggestion,
    openSuggestSelector,
    turnOffStatusLoading,
  },
)(MessageList);

export default connectedMessageList;
