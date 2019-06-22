import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';

import { NewResponseCreator } from './NewResponseCreator';
import { closeCreator, openConfirm, closeConfirm, submitRequest } from './Action';
import { creatorFormName } from './creator-form';

const selector = formValueSelector(creatorFormName);

export default connect(
  (state: any) => {
    const { intentEditor: { category, creator } } = state;

    return {
      loading: creator.loading,
      open: creator.open,
      confirm: creator.confirm,
      formData: selector(
        state, 'category', 'subCategory', 'sampleQuestion', 'response'),
    };
  },
  { closeCreator, openConfirm, closeConfirm, submitRequest },
)(NewResponseCreator);
