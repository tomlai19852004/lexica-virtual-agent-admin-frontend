import * as React from 'react';
import { Field, InjectedFormProps } from 'redux-form';
import { Form, Segment, Button, Label } from 'semantic-ui-react';

export enum ResponseType {
  TEXT = 'TEXT',
}

export interface EditorFormProps extends InjectedFormProps {
  id: string;
  responses: any[];
  sampleQuestion: string;
}

export class EditorForm extends React.PureComponent<EditorFormProps> {
  render() {
    const { handleSubmit, responses, sampleQuestion } = this.props;

    const forms = responses.map((response, responseIndex) => {
      const { _id: id, messages } = response;
      return (
        <Segment key={id} basic={true}>
          <div className="field">
            <label htmlFor="response-editor-input-area">Response(s)</label>
            {messages.map((message: any, index: number) => {

              return (
                <Field
                  key={index}
                  name={`responses[${responseIndex}].messages[${index}]['en-GB']`}
                  component="textarea"
                  type="text"
                  rows={5}
                />
              );
            })}
          </div>
        </Segment>
      );
    });

    return (
      <Form size="large" onSubmit={handleSubmit}>
        <Segment key="SampleQuestion" basic={true}>
          <div className="field">
            <label htmlFor="response-editor-SampleQuestion">Sample Question</label>
            <Field
              name={`sampleQuestion`}
              component="input"
              type="text"
            />
            <Label pointing="above">Will not affect lexica response.</Label>
          </div>
        </Segment>
        {forms}
      </Form>
    );
  }
}
