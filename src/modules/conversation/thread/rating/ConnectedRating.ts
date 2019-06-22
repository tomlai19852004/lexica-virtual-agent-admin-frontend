import { connect } from 'react-redux';
import { RatingModal } from './Rating';
import { reduxForm, formValueSelector } from 'redux-form';
import { closeRating, submitReview } from './Actions';
import isEmpty from 'lodash-es/isEmpty';
import toNumber from 'lodash-es/toNumber';
import isNaN from 'lodash-es/isNaN';
import isNil from 'lodash-es/isNil';

export const formName = 'issueConversation:chatbotMessageRatingForm';

const validate = (values: { [key: string]: any }) => {
  // require either rate or newType label
  // but dont care if both of them are selected
  // because action submitReview will send undefined rate
  const hasValidRating = values.rate && values.rate > 0;
  const newType = values.newType && values.newType === true;
  if (!hasValidRating && !newType) {
    return {
      _error: 'rate',
    };
  }
  return {};
};

const formConnectedRatingModal = reduxForm({
  validate,
  form: formName,
  // touchOnChange: true,
  enableReinitialize: true,
})(RatingModal);

export default connect<any, any, any, any>(
  (state) => {
    const { messages, rating: { index, loading } } = state.conversation.thread;
    const { id } = state.conversation.list.selectedConversation;
    const hasNewTypeValue = formValueSelector(formName)(state, 'newType');

    if (!isNil(index) && index < messages.length) {
      const message = messages[index];
      const { comment } = message;
      return {
        id,
        loading,
        message,
        hasNewTypeValue,
        submittedRating: comment ? comment.rating : undefined,
        initialValues: comment ? {
          rate: comment.rating,
          comment: comment.text,
          newType: comment.newType,
        } : undefined,
      };
    }

    return {
      id,
      loading,
      hasNewTypeValue,
      message: {
        body: {
          message: '',
        },
      },
    };
  },
  {
    closeRating,
    submitReview,
  },
)(formConnectedRatingModal);
