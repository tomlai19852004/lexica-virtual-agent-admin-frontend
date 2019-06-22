import * as React from 'react';
import { AnyAction } from 'redux';
import map from 'lodash-es/map';
import startCase from 'lodash-es/startCase';
import defaultTo from 'lodash-es/defaultTo';
import every from 'lodash-es/every';
import at from 'lodash-es/at';
import isString from 'lodash-es/isString';
import { Modal, Button, Dimmer, Loader, List, Label } from 'semantic-ui-react';

import { ConnectedCreatorForm } from './creator-form';

export interface NewResponseCreatorProps {
  loading: boolean;
  open: boolean;
  confirm: boolean;
  formData: {
    [key: string]: string | undefined;
  };
  closeCreator(): AnyAction;
  openConfirm(): AnyAction;
  closeConfirm(): AnyAction;
  submitRequest(): any;
}

export class NewResponseCreator extends React.PureComponent<NewResponseCreatorProps> {
  render() {
    const {
      loading, open, closeCreator, openConfirm, closeConfirm, formData, confirm, submitRequest,
    } = this.props;

    const requiredKey = ['category', 'subCategory', 'sampleQuestion', 'response'];
    const formDataResult = map(requiredKey, key => ({
      key,
      header: startCase(key),
      content: defaultTo<string | JSX.Element>(
        formData[key], <Label icon="exclamation" content="Empty" color="red"/>),
    }));

    return (
      <Modal open={open} dimmer="blurring">
        <Modal.Header>Create New Response Request</Modal.Header>
        <Modal.Content as={Dimmer.Dimmable} dimmed={loading} blurring={true}>
          <Dimmer active={loading}>
            <Loader inline="centered" indeterminate={true}>Creating request</Loader>
          </Dimmer>
          <Modal.Description>
            <p>
              This will create a new request to add a new response.
              The request will be handled by the engineer.
            </p>
            <ConnectedCreatorForm/>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button
            icon="remove"
            content="Cancel"
            disabled={loading}
            onClick={closeCreator}
          />
          <Button
            color="teal"
            icon="send"
            content="Submit"
            disabled={loading}
            onClick={openConfirm}
          />
          <Modal
            closeOnEscape={false}
            closeOnRootNodeClick={false}
            open={confirm}
          >
            <Modal.Header>Please Confirm the request data</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <p>The data you sent will no longer be able to edit.</p>
                <p>Please check if everything is correct.</p>
                <List divided={true} items={formDataResult} />
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <Button icon="arrow left" content="Back" onClick={closeConfirm}/>
              <Button
                icon="checkmark"
                color="blue"
                content="Confirm"
                disabled={!every(at(formData, requiredKey), isString)}
                onClick={submitRequest.bind(null, formData)}
              />
            </Modal.Actions>
          </Modal>
        </Modal.Actions>
      </Modal>
    );
  }
}
