const types = {
  ASYNC_SEND_CONVERSATION_MESSAGE:
    'ISSUE_CONVERSATION:MESSAGE_INPUT:SEND_CONVERSATION_MESSAGE.ASYNC',
  ASYNC_CLOSE_CONVERSATION_ISSUE:
    'ISSUE_CONVERSATION:MESSAGE_INPUT:ASYNC_CLOSE_CONVERSATION_ISSUE.ASYNC',
  HOLD_UNSENT_MESSAGE:
    'ISSUE_CONVERSATION:MESSAGE_INPUT:HOLD_UNSENT_MESSAGE',
};

const sendConversationMessage = (conversation: any, message: any) => {
  return ({
    conversation,
    ...message,
    type: types.ASYNC_SEND_CONVERSATION_MESSAGE,
  });
};

const closeConversationIssue = (conversation: any) => ({
  conversation,
  type: types.ASYNC_CLOSE_CONVERSATION_ISSUE,
});

const holdUnsentMessage = (message: any, conversationId: any) => {
  const unsentMessage: {[key: string]: any} = {};
  unsentMessage[conversationId] = message ? { message } : undefined;
  return {
    type: types.HOLD_UNSENT_MESSAGE,
    payload: unsentMessage,
  };
};

export {
  types,
  sendConversationMessage,
  closeConversationIssue,
  holdUnsentMessage,
};
