import * as React from 'react';
import { Field, InjectedFormProps } from 'redux-form';
import { Form, Segment, Button, FormInputProps } from 'semantic-ui-react';

export interface LoginFormProps extends InjectedFormProps {
  // state
  unis: { [key: string]: string };
  authToken: string;

  // function
  fetchTokenTypes: any;
}

export class LoginForm extends React.PureComponent<LoginFormProps> {

  componentWillMount() {
    this.props.fetchTokenTypes();
  }

  render() {
    const { handleSubmit, submitting, unis } = this.props;

    return (
      <Form size="large" onSubmit={handleSubmit}>
        <Segment stacked={true}>
          <div className="field">
            <div className="ui fluid left icon input">
              <i className="user icon"/>
              <Field type="text" name="username" component="input" placeholder="Username"/>
            </div>
          </div>
          <div className="field">
            <div className="ui fluid left icon input">
              <i className="lock icon"/>
              <Field type="password" name="password" component="input" placeholder="Password"/>
            </div>
          </div>
          <div className="field">
            <Field name="uni" component="select" className="ui fluid selection dropdown">
              <option value="">Select a system</option>
              {Object.keys(unis).map(
                (uni:string) => <option key={uni} value={uni}>{unis[uni]}</option>)}
            </Field>
          </div>
          <Button color="teal" fluid={true} size="large" disabled={submitting}>Login</Button>
        </Segment>
      </Form>
    );
  }
}
