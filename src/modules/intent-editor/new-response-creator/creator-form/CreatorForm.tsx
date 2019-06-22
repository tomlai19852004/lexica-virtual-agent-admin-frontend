import * as React from 'react';
import { Field, InjectedFormProps } from 'redux-form';
import { Form } from 'semantic-ui-react';

export interface CreatorFormProps extends InjectedFormProps {

}

export class CreatorForm extends React.PureComponent<CreatorFormProps> {
  render() {
    return (
      <Form>
        <Form.Field
          label="Category"
          disabled={true}
          control={Field}
          name="category"
          component="input"
        />
        <Form.Field
          label="Sub-Category"
          disabled={true}
          control={Field}
          name="subCategory"
          component="input"
        />
        <Form.Field
          label="Sample Question"
          control={Field}
          name="sampleQuestion"
          component="input"
        />
        <Form.Field
          label="Response"
          control={Field}
          name="response"
          component="textarea"
        />
      </Form>
    );
  }
}
