import { connect } from 'react-redux';
import { IssueList, IssueListPropType } from './IssueList';
import {
  fetchInitialConversations,
  selectConversation,
  startConversationSync,
  stopConversationSync,
  updateConversationStatus,
  updateSearchTerm,
  fetchNextConversationPage,
} from './Actions';

const connectedIssueList = connect(
  (state: any) => ({
    conversations: state.conversation.list.conversations,
    selectedConversation: state.conversation.list.selectedConversation,
    conversationStatus: state.conversation.list.conversationStatus,
    searchTerm: state.conversation.list.searchTerm,
    loading: state.conversation.list.conversationLoading,
    nextPage: state.conversation.list.lastPage + 1,
    hasNext: state.conversation.list.hasNext,
    pageSize: state.conversation.defaultPageSize,
  }),
  {
    selectConversation,
    startConversationSync,
    stopConversationSync,
    updateConversationStatus,
    updateSearchTerm,
    fetchNextConversationPage,
  },
)(IssueList);

export default connectedIssueList;
