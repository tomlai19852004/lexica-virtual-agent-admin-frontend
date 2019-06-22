import * as React from 'react';
import { connect } from 'react-redux';
import { IntentList, IntentListProps } from './IntentList';
import { startEdit } from '../../response-editor';
import { selectCategory } from '../../intent-category/Action';

export default connect<any, any, any>(
  (state: any) => ({
    searchTerm: state.intentEditor.searchTerm,
    category: state.intentEditor.category,
  }),
  { startEdit, selectCategory },
)(IntentList);
