import { connect } from 'react-redux';
import { ConfigProps, DecoratedComponentClass, reduxForm } from 'redux-form';
import { IntentEditor, IntentEditorProps } from './IntentEditor';
import {
  fetchResources,
  fetchPendingResources,
  updateSearchTerm,
  updatePageStatus,
} from './Action';
import { resetCategory } from './intent-category';

const connectedIntentEditor = connect(
  (state: any) => ({
    category: state.intentEditor.category,
    resources: state.intentEditor.resources,
    searchTerm: state.intentEditor.searchTerm,
    currentPage: state.intentEditor.currentPage,
  }),
  { resetCategory, fetchResources, fetchPendingResources, updateSearchTerm, updatePageStatus },
)(IntentEditor);

export default connectedIntentEditor;
