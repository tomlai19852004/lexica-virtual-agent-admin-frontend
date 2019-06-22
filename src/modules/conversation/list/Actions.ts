import { ConversationStatus } from '../../../commons/Constants';

const types = {
  ASYNC_FETCH_CONVERSATIONS:
    'ISSUE_CONVERSATION:ISSUE_LIST:FETCH_CONVERSATIONS.ASYNC',
  ASYNC_CONVERSATION_SEEN: 'ISSUE_CONVERSATION:ISSUE_LIST:CONVERSATION_SEEN.ASYNC',
  ASYNC_FETCH_FIRST_CONVERSATIONS_PAGE:
    'ISSUE_CONVERSATION:ISSUE_LIST:FETCH_FIRST_PAGE_CONVERSATIONS.ASYNC',

  SELECT_CONVERSATION: 'ISSUE_CONVERSATION:ISSUE_LIST:SELECT_CONVERSATION',
  CLEAR_SELECTED_CONVERSATION: 'ISSUE_CONVERSATION:ISSUE_LIST:CLEAR_SELECTED_CONVERSATION',
  START_CONVERSATION_SYNC: 'ISSUE_CONVERSATION:ISSUE_LIST:START_CONVERSATION_SYNC',
  STOP_CONVERSATION_SYNC: 'ISSUE_CONVERSATION:ISSUE_LIST:STOP_CONVERSATION_SYNC',
  UPDATE_CONVERSATION_STATUS: 'ISSUE_CONVERSATION:ISSUE_LIST:UPDATE_CONVERSATION_STATUS',
  UPDATE_SEARCH_TERM: 'ISSUE_CONVERSATION:ISSUE_LIST:UPDATE_SEARCH_TERM',
  ASYNC_FETCH_NEXT_CONVERSATION_PAGE: 'ISSUE_CONVERSATION:ISSUE_LIST:FETCH_NEXT_PAGE.ASYNC',
};

const fetchInitialConversations =
  (status = ConversationStatus.OPEN, pageSize: number, query: string) => ({
    type: types.ASYNC_FETCH_CONVERSATIONS,
    payload: {
      status,
      pageSize,
      query,
      pageNumber: 0,
    },
  });

const fetchFirstConversationPage =
  (status = ConversationStatus.OPEN, pageSize: number, query: string) => ({
    type: types.ASYNC_FETCH_FIRST_CONVERSATIONS_PAGE,
    payload: {
      status,
      pageSize,
      query,
      pageNumber: 0,
    },
  });

const fetchNextConversationPage =
  (status: ConversationStatus, pageNumber: number, pageSize: number, query: string) => ({
    type: types.ASYNC_FETCH_NEXT_CONVERSATION_PAGE,
    payload: {
      status,
      pageNumber,
      pageSize,
      query,
    },
  });

const conversationSeen = (conversation: any) => ({
  type: types.ASYNC_CONVERSATION_SEEN,
  payload: {
    conversation,
  },
});

const selectConversation = (conversation: any) => ({
  conversation,
  type: types.SELECT_CONVERSATION,
});

const clearSelectedConversation = () => ({
  type: types.CLEAR_SELECTED_CONVERSATION,
});

const startConversationSync = () => ({
  type: types.START_CONVERSATION_SYNC,
});

const stopConversationSync = () => ({
  type: types.STOP_CONVERSATION_SYNC,
});

const updateConversationStatus = (status: ConversationStatus) => ({
  type: types.UPDATE_CONVERSATION_STATUS,
  payload: {
    status,
  },
});

const updateSearchTerm = (status: string) => ({
  type: types.UPDATE_SEARCH_TERM,
  payload: {
    status,
  },
});

export {
  types,
  fetchInitialConversations,
  conversationSeen,
  selectConversation,
  clearSelectedConversation,
  startConversationSync,
  stopConversationSync,
  updateConversationStatus,
  updateSearchTerm,
  fetchNextConversationPage,
  fetchFirstConversationPage,
};
