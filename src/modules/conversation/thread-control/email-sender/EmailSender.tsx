import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as styles from './styles.css';
import { StylePropType } from '../../../../commons/PropTypes';
import { Modal, Button, TextArea, Label, Form, Input, Message, Icon } from 'semantic-ui-react';
import { modes } from '../../../../commons/Constants';
import { isEmpty } from 'lodash';
import { Field, Fields, InjectedFormProps, SubmissionError } from 'redux-form';
import defaultTo from 'lodash-es/defaultTo';

interface EmailSenderProps extends StylePropType {
  currentMode: string;
  selectedMessages: any;
  status: any;
  recipients: any;
  sendingStatus: string;
  styles: any;
  sendEmail: () => any;
  closeEmailSender: () => any;
  handleSubmit: () => any;
  renderField: () => any;
}

class EmailSender extends React.PureComponent<EmailSenderProps> {

  renderField = ({ name, input, type, placeholder, meta: { touched, error } }: any) => {
    const nameTextArea = placeholder + 'TextArea';
    const className = 'styles.' + nameTextArea;
    return (
      <div className={styles.field}>
        { placeholder === 'body'
          ? <TextArea
            className={className}
            {...input}
            placeholder={placeholder}
            type={type}
            autoHeight={true}
          />
          : placeholder === 'recipients'
          ? <Input
            className={className}
            {...input}
            placeholder={placeholder}
            fluid={true}
            iconPosition="left"
          >
            <Icon name="at" />
            <input
              autoComplete="off"
            />
          </Input>
          : <Input
            className={className}
            {...input}
            placeholder={placeholder}
            fluid={true}
            iconPosition="left"
          >
            <Icon name="terminal" />
            <input />
          </Input>
        }
        {(touched && error)
          ? <div className={styles.errorSignal}>{error}</div>
          : ''
        }
        </div>
    );
  }

  render() {
    const {
      // variable
      currentMode,
      selectedMessages,
      status,
      recipients,
      sendingStatus,
      // function
      sendEmail,
      closeEmailSender,
      renderField,
      handleSubmit,
    } = this.props;

    const shouldOpen = (currentMode === modes.redirectToEmail && status.open === true);

    return(
      <Modal open={shouldOpen} className={currentMode + 'Modal'}>
        <Modal.Header>Email Sender</Modal.Header>
          <Modal.Content>
            <Modal.Description>
            <Form onSubmit={handleSubmit}>
              <Field
                name="mailTo"
                type="text"
                component={this.renderField}
                placeholder="recipients"
              />
              <Field
                name="subject"
                type="text"
                component={this.renderField}
                placeholder="subject"
              />
              <Field
                name="body"
                type="text"
                component={this.renderField}
                placeholder="body"
              />
              { sendingStatus === 'fail'
                ? <Message
                  header="Something went wrong"
                  content={
                    'Check if network is connected or form fields are filled with valid values.'
                  }
                />
                : ''
              }
              <Button
                icon="remove"
                color="red"
                content="discard"
                type="button"
                onClick={closeEmailSender.bind(null)}
              />
              <Button
                icon="send"
                color="green"
                content="send"
                type="submit"
                className={styles.sendButton}
                loading={status.sending}
                disabled={status.sending}
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
      </Modal>
    );
  }
}

export { EmailSender, EmailSenderProps };
