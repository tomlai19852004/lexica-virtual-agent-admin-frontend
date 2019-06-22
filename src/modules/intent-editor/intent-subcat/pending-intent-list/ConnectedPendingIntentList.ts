import * as React from 'react';
import { connect } from 'react-redux';
import { PendingIntentList, PendingIntentListProps } from './PendingIntentList';
import { startEdit } from '../../response-editor';

export default connect(
  (state: any) => ({
    pendingItems: state.intentEditor.pendingResources.map(),
  }),
)(PendingIntentList);
