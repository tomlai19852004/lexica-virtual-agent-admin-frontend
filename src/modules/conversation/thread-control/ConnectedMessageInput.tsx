import { connect } from 'react-redux';
import { ConfigProps, DecoratedComponentClass, reduxForm, reset } from 'redux-form';
import { StylePropType } from '../../../commons/PropTypes';
import { OutsideMessageInputProps, MessageInput } from './MessageInput';
import { sendConversationMessage, closeConversationIssue, holdUnsentMessage } from './Actions';

const formName = 'issueConversation:issueMessageForm';

const threadControl = {
  lengthLimit: 640,
  warnEmpty: false, // turn on if you want more info for debugging
  warnEmptyMessage: () => threadControl.warnEmpty ? 'You typed nothing' : ' ',
  warnEmptyAfterTrim: () => threadControl.warnEmpty ? 'You just typed space' : ' ',
  warnTooLongMessage: (messageLength: number) =>
    (`Response must be shorter than ${threadControl.lengthLimit} characters.
    Now it is ${messageLength} char-long.`),
};

const validate = (values: {[key: string]: any}) => {
  const errors: {[key: string]: any} = {};
  if (!values.message) {
    errors.message = threadControl.warnEmptyMessage();
  } else if (!values.message.trim()) {
    errors.message = threadControl.warnEmptyAfterTrim();
  } else if (values.message.length > threadControl.lengthLimit) {
    errors.message = threadControl.warnTooLongMessage(values.message.length);
  }
  return errors;
};

const fromConnectedMessageInput = reduxForm({
  validate,
  enableReinitialize: true,
  form: formName,
})(MessageInput);

const connectedMessageInput = connect<any, any, StylePropType, any>(
  (state: any) => ({
    conversation: state.conversation.list.selectedConversation,
    conversationStatus: state.conversation.list.conversationStatus,
    unsentMessage: state.conversation.thread.messageInput.unsentMessage,
    initialValues:
      state.conversation.thread.messageInput.unsentMessage
      [state.conversation.list.selectedConversation.id],
  }),
  {
    sendConversationMessage,
    closeConversationIssue,
    holdUnsentMessage,
    resetMessageContent: reset,
  },
  (stateProps, dispatchProps, ownProps) => {
    const sendConversationMessage
      = dispatchProps.sendConversationMessage.bind(null, stateProps.conversation);
    return {
      ...stateProps,
      ...ownProps,
      sendConversationMessage,
      onSubmit: sendConversationMessage,
      closeConversationIssue:
        dispatchProps.closeConversationIssue.bind(null, stateProps.conversation),
      resetMessageContent: dispatchProps.resetMessageContent.bind(null, formName),
      holdUnsentMessage: dispatchProps.holdUnsentMessage,
    };
  },
)(fromConnectedMessageInput);

export { formName };

export default connectedMessageInput;
