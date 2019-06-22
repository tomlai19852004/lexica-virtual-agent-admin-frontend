import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Field, InjectedFormProps, SubmissionError } from 'redux-form';
import { Button, Menu, Icon, Checkbox, Popup, TextArea, Label } from 'semantic-ui-react';
import defaultTo from 'lodash-es/defaultTo';
import { StylePropType } from '../../../commons/PropTypes';
import { ConversationStatus } from '../../../commons/Constants';
import { ConnectedSuggestedAnswer } from './suggested-answer';
import { ConnectedEmailSender } from './email-sender';
import * as styles from './styles.css';

interface OutsideMessageInputProps extends StylePropType {
  conversation: any;
  conversationStatus: ConversationStatus;
  unsentMessage: {[key: string]: any};
  otherProps: any;

  sendConversationMessage: (message: any) => any;
  closeConversationIssue: () => any;
  resetMessageContent: () => any;
  holdUnsentMessage: (message: any, conversationId: any) => any;
}

interface MessageInputProps extends OutsideMessageInputProps, InjectedFormProps {

}

class MessageInput extends React.PureComponent<MessageInputProps> {

  componentDidUpdate(prevProps: any) {
    if (prevProps.conversation.id !== this.props.conversation.id) {
      this.props.resetMessageContent();
    }
  }

  renderField = ({ input, type, placeholder, meta: { touched, error } }: any) => {
    return (
      <div>
        <TextArea
          className={styles.textarea}
          {...input}
          placeholder={placeholder}
          type={type}
          onKeyDown={this.boundSend}
          onChange={this.triggerHoldUnsentMessage}
        />
        <div className={styles.errorSignal}>
          {error}
        </div>
      </div>
    );
  }

  triggerHoldUnsentMessage = (e: any) =>
    this.props.holdUnsentMessage(e.target.value, this.props.conversation.id)

  sendingMessage = false; // checked to avoid frequent keyboard form submission

  boundSend = this.send.bind(this);

  send(e: any) {
    const { sendConversationMessage } = this.props;
    if (
      e.keyCode === 13 &&
      e.shiftKey === false &&
      e.target.value.trim() &&
      !this.sendingMessage) {
      this.sendingMessage = true;
      e.preventDefault();
      sendConversationMessage({
        message: e.target.value.trim(),
      });
      setTimeout(() => this.sendingMessage = false , 1000);
    }
  }

  render() {
    const {
      conversation,
      conversationStatus,
      handleSubmit,
      submitting,
      pristine,
      closeConversationIssue,
      unsentMessage,
      otherProps,
    } = this.props;

    if (conversation.id) {
      const placeholder = `Response to ${conversation.firstName} ${conversation.lastName}`;
      const noInput = !Boolean(unsentMessage[conversation.id]);
      return (
        <form
          onSubmit={handleSubmit}
          className={`${defaultTo(this.props.className, '')} ${styles.container}`}
        >
          <ConnectedSuggestedAnswer />
          <ConnectedEmailSender {...otherProps} />
          <Field
            name="message"
            component={this.renderField}
            type="text"
            placeholder={placeholder}
            className={styles.textarea}

          />
          <div className={styles.inputBottom}>
            {
              (() => {
                if (conversationStatus === ConversationStatus.OPEN) {
                  return (<Button
                    color="blue"
                    type="button"
                    labelPosition="right"
                    disabled={submitting}
                    onClick={closeConversationIssue}
                    icon="user close"
                    className={styles.btnCloseIssue}
                    content="Close Issue"
                  />);
                }
              })()
            }
            <Button
              color="green"
              type="submit"
              labelPosition="left"
              disabled={noInput || submitting}
              icon="send"
              className={styles.btnSendMessage}
              content="Send"
            />
          </div>
        </form>
      );
    }
    return null;
  }
}

export {
  OutsideMessageInputProps,
  MessageInputProps,
  MessageInput,
};
