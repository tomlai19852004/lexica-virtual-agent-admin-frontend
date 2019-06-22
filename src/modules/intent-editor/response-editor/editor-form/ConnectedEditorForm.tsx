import { connect } from 'react-redux';
import { ConfigProps, DecoratedComponentClass, reduxForm } from 'redux-form';
import { EditorForm, EditorFormProps } from './EditorForm';
import get from 'lodash-es/get';
import map from 'lodash-es/map';

import { updateResponse } from '../Action';

const fromConnectedEditorForm = reduxForm({
  form: 'intent_editor:response_editor:editor_form',
})(EditorForm);

export default connect<any, any, any, any>(
  (state: any) => {
    const { resources, editor, category } = state.intentEditor;
    return {
      ...get(resources[category], editor.name),
    };
  },
  { updateResponse },
  (stateProps, dispatchProps, ownProps) => {
    const responses = map(stateProps.responses, (response: any) => {
      return response;
    });

    return {
      ...ownProps,
      ...stateProps,
      ...dispatchProps,
      onSubmit: dispatchProps.updateResponse.bind(null, stateProps.sampleQuestion),
      initialValues: {
        responses,
        resourceId: stateProps.id,
        sampleQuestion: stateProps.sampleQuestion,
      },
    };
  },
)(fromConnectedEditorForm);
