import * as React from 'react';
import {
  Field,
  InjectedFormProps,
  WrappedFieldProps,
  WrappedFieldInputProps,
  formValueSelector,
 } from 'redux-form';
import { Modal, Rating, Form, Button, Message, RatingProps } from 'semantic-ui-react';
import isNil from 'lodash-es/isNil';
import isString from 'lodash-es/isString';
import isEmpty from 'lodash-es/isEmpty';
import { formName } from './ConnectedRating';

interface RatingModalProps extends InjectedFormProps {
  id: string;
  message: any;
  loading: boolean;
  forms: any;
  hasNewTypeValue: boolean;
  submittedRating: number;
  closeRating: () => any;
  submitReview: () => any;
  toggleNewType: () => any;
}

function updateRating(event: Event, data: WrappedFieldProps & RatingProps) {
  const { input: { onChange }, rating } = data;
  onChange(rating);
}

class RatingModal extends React.PureComponent<RatingModalProps> {
  render() {
    const {
      loading,
      hasNewTypeValue,
      handleSubmit,
      closeRating,
      anyTouched,
      error,
      submitReview,
      pristine,
      id,
      message: { body: { message }, rate, id: messageId },
      toggleNewType,
      submittedRating,
    } = this.props;

    return (
      <Modal open={!isEmpty(messageId)} size="tiny">
        <Modal.Header>Review the response</Modal.Header>
        <Modal.Content>
          <Modal.Description>
            <Message>
              {(message as string).split('\n').map((v, i) => (
                <p key={i}>{v}</p>
              ))}
            </Message>
            <Form>
              <Form.Field
                label="Rating"
                control={Field}
                name="rate"
                component={Rating}
                maxRating={5}
                icon="star"
                size="massive"
                onRate={updateRating}
                error={anyTouched && error === 'rate'}
                disabled={hasNewTypeValue}
                defaultRating={submittedRating}
                clearable={true}
              />
              <Form.Field
                control={Field}
                label="The question is new to the intent library"
                name="newType"
                component="input"
                type="checkbox"
              />
              <Form.Field
                label="Comment"
                control={Field}
                name="comment"
                component="textarea"
                disabled={loading}
              />
            </Form>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            content="Cancel"
            disabled={loading}
            onClick={closeRating}
          />
          <Button
            content="Submit"
            onClick={handleSubmit(submitReview.bind(null, id, messageId))}
            loading={loading}
            disabled={loading || isString(error)}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export {
  RatingModal,
  RatingModalProps,
};
