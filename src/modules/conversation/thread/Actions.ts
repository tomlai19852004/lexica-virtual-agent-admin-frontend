const types = {
  ASYNC_FETCH_INITIAL_MESSAGES:
    'ISSUE_CONVERSATION:MESSAGE_DISPLAY:FETCH_CONVERSATION_MESSAGES.ASYNC',
  ASYNC_FETCH_FIRST_MESSAGE_PAGE:
    'ISSUE_CONVERSATION:MESSAGE_DISPLAY:FETCH_FIRST_CONVERSATION_MESSAGE_PAGE.ASYNC',
  ASYNC_FETCH_NEXT_MESSAGE_PAGE:
    'ISSUE_CONVERSATION:MESSAGE_DISPLAY:FETCH_NEXT_CONVERSATION_MESSAGE_PAGE.ASYNC',
  CLEAR_MESSAGES: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:FETCH_ISSUE_MESSAGES',
  NEXT_PAGE: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:NEXT_PAGE',
  START_MESSAGES_SYNC: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:START_MESSAGES_SYNC',
  STOP_MESSAGES_SYNC: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:STOP_MESSAGES_SYNC',
  ASYNC_FETCH_SUGGESTION_FOR_LATEST_ENQUIRY:
    'ISSUE_CONVERSATION:MESSAGE_DISPLAY:ASYNC_FETCH_SUGGESTION_FOR_LATEST_ENQUIRY',
};

const fetchInitialMessages = (conversation: any, pageSize: number, pageNumber = 0) => ({
  payload : {
    conversation,
    pageSize,
    pageNumber,
  },
  type: types.ASYNC_FETCH_INITIAL_MESSAGES,
});

const fetchFirstMessagePage = (conversation: any, pageSize: number, pageNumber = 0) => ({
  payload : {
    conversation,
    pageSize,
    pageNumber,
  },
  type: types.ASYNC_FETCH_FIRST_MESSAGE_PAGE,
});

const fetchNextMessagePage = (conversation: any, pageSize: number, pageNumber: number) => ({
  payload : {
    conversation,
    pageSize,
    pageNumber,
  },
  type: types.ASYNC_FETCH_NEXT_MESSAGE_PAGE,
});

const clearMessages = () => ({
  type: types.CLEAR_MESSAGES,
});

const startMessagesSync = () => ({
  type: types.START_MESSAGES_SYNC,
});

const stopMessagesSync = () => ({
  type: types.STOP_MESSAGES_SYNC,
});

export {
  types,
  fetchInitialMessages,
  fetchFirstMessagePage,
  fetchNextMessagePage,
  clearMessages,
  startMessagesSync,
  stopMessagesSync,
};
