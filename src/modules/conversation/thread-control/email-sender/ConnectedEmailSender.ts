import { connect } from 'react-redux';
import { EmailSenderProps, EmailSender } from './EmailSender';
import {
  ConfigProps,
  DecoratedComponentClass,
  reduxForm,
  reset,
  FormSubmitHandler,
} from 'redux-form';
import { sendEmail, closeEmailSender } from './Actions';
import { StylePropType } from '../../../../commons/PropTypes';
import { findIndex, find, matchesProperty, isEmpty, union, orderBy } from 'lodash';

const formName = 'issueConversation:EmailSenderForm';

const contentControl = {
  warnEmpty: true, // turn on if you want more info for debugging
  warnEmptyMessage: () => contentControl.warnEmpty ? 'You typed nothing' : ' ',
  warnEmptyAfterTrim: () => contentControl.warnEmpty ? 'You just typed space' : ' ',
};

function validateEmail(emails: string) {
  const emailsArr = emails.replace(/\s/, '').split(',');
  const re = /\S+@\S+\.\S+/;
  let valid = true;
  for (let i = 0; i < emailsArr.length; i += 1) {
    if (!re.test(emailsArr[i])) {
      valid = false;
      break;
    }
  }
  return valid;
}

const validate = (values: {[key: string]: any}) => {
  const errors: {[key: string]: any} = {};
  if (!values.mailTo) {
    errors.mailTo = 'No email address';
  } else if (!values.mailTo.trim()) {
    errors.mailTo = 'No email address';
  } else if (!validateEmail(values.mailTo)) {
    errors.mailTo = 'May contain invalid email address';
  }

  if (!values.subject) {
    errors.subject = 'No subject';
  } else if (!values.subject.trim()) {
    errors.subject = 'No subject';
  }

  if (!values.body) {
    errors.body = contentControl.warnEmptyMessage();
  } else if (!values.body.trim()) {
    errors.body = contentControl.warnEmptyAfterTrim();
  }

  return errors;
};

const formConnectedEmailSender = reduxForm({
  validate,
  enableReinitialize: true,
  onSubmit: sendEmail as FormSubmitHandler,
  form: formName,
})(EmailSender as any);

const connectedEmailSender = connect<any, any, StylePropType, any>(
  (state: any) => {
    // because the default email body requires a lot of information from state
    // several const are to be assigned before the return object
    const selectedRequest = state.conversation.thread.controller.selectedMessages.REQUEST;
    const selectedResponse = state.conversation.thread.controller.selectedMessages.RESPONSE;
    const selectedMessages: any = orderBy(
      union(selectedRequest, selectedResponse),
      ['date'],
      ['asc'],
    );
    const { firstName, lastName, messenger, id } = state.conversation.list.selectedConversation;
    const messages = state.conversation.thread.messages;
    const allowEmailSenderOn = !isEmpty(selectedRequest);
    const emailOpening =
      'Dear Sir/Madam,\n'
      + `We received `
      + `${selectedRequest.length > 1 ? 'some questions' : 'one question'} `
      + `from student/staff that need the help from your side to solve. \n`;
    let mainText = '';
    selectedMessages.map((message: any, index: number) => {
      const markMessageGroupBegin =
        index === 0 || selectedMessages[index - 1].type !== message.type;
      mainText +=
        '\n'
        + (markMessageGroupBegin
            ? message.type === 'REQUEST'
              ? `User\'s question${selectedRequest.length > 1 ? 's' : ''}:\n`
              : `Our response${selectedResponse.length > 1 ? 's' : ''}:\n`
            : '')
        + `•    ${message.body.message}`;
    });
    const emailEnding =
      `\n\n\n---------------\nFor Librarians\' reference, `
      + `the questions come from conversation with `
      + `${firstName} ${lastName} on ${messenger} platform. `
      + `The full conversation could be retrieved easily `
      + `by searching id ${id} or questioner's name. `;

    // the returning state
    return {
      status: state.conversation.emailSender.status,
      sendingStatus: state.conversation.emailSender.warning,
      currentMode: state.conversation.thread.controller.mode,
      selectedMessages: state.conversation.thread.controller.selectedMessages,
      initialValues: {
        body: allowEmailSenderOn
          ? emailOpening + mainText + emailEnding
          : 'Hello world!',
      },
    };
  },
  {
    sendEmail,
    closeEmailSender,
  },
  (stateProps, dispatchProps, ownProps: any) => {
    return {
      ...stateProps,
      ...ownProps,
      onSubmit: dispatchProps.sendEmail.bind(null, ...ownProps),
      closeEmailSender: dispatchProps.closeEmailSender,
    };
  },
)(formConnectedEmailSender);

export default connectedEmailSender;
