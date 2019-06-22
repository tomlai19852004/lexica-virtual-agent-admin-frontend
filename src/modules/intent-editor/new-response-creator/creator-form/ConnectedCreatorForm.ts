import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';

import { CreatorForm } from './CreatorForm';

export const creatorFormName = 'intent_editor:new_response_creator:creator_form';

const fromConnectedCreatorForm = reduxForm({
  form: creatorFormName,
})(CreatorForm);

export default connect<any, any, any>(
  (state: any) => {
    const { creator, category } = state.intentEditor;
    return {
      initialValues: {
        category,
        subCategory: creator.subCat,
      },
    };
  },
)(fromConnectedCreatorForm);
