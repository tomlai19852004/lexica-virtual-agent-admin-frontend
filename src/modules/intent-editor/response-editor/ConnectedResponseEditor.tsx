import * as React from 'react';
import { connect } from 'react-redux';
import { submit } from 'redux-form';
import isNil from 'lodash-es/isNil';
import at from 'lodash-es/at';
import { ResponseEditor, ResponseEditorProps } from './ResponseEditor';
import { cancelEdit, deleteResponse } from './Action';

export default connect(
  (state: any) => ({
    active: state.intentEditor.editor.active,
    loading: state.intentEditor.editor.loading,
    resourceId: state.intentEditor.editor.name,
    isDeleting: !isNil(at(
      state.intentEditor.resources[state.intentEditor.category],
      state.intentEditor.editor.name + '.pendingAction')[0]),
  }),
  { submit, cancelEdit, deleteResponse },
)(ResponseEditor);
