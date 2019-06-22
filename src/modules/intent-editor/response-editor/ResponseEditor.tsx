import * as React from 'react';
import { Modal, Button, Form, Dimmer, Loader, Segment } from 'semantic-ui-react';
import { Field } from 'redux-form';
import { ConnectedEditorForm } from './editor-form';

export interface ResponseEditorProps {
  active: boolean;
  loading: boolean;
  isDeleting: boolean;
  submit: () => any;
  cancelEdit: () => any;
  deleteResponse: () => any;
  resourceId: string;
}

export class ResponseEditor extends React.PureComponent<ResponseEditorProps> {
  render() {
    const {
      active, submit, loading, isDeleting, cancelEdit, deleteResponse, resourceId,
    } = this.props;
    return (
      <Modal open={active}>
        <Modal.Header>Response Editor</Modal.Header>
        <Modal.Content as={Dimmer.Dimmable} scrolling={true} dimmed={loading} blurring={true}>
          <Dimmer active={loading}>
            <Loader inline="centered" indeterminate={true}>Updating Response</Loader>
          </Dimmer>
          <ConnectedEditorForm/>
        </Modal.Content>
        <Modal.Actions>
          <Button
            icon="trash"
            content="Delete"
            color="red"
            disabled={loading || isDeleting}
            onClick={deleteResponse.bind(null, resourceId)}
            floated="left"
          />
          <Button icon="remove" content="Cancel" disabled={loading} onClick={cancelEdit}/>
          <Button
            color="teal"
            icon="checkmark"
            content="Submit"
            disabled={loading}
            onClick={submit.bind(null, 'intent_editor:response_editor:editor_form')}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}
