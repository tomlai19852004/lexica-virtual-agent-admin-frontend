import * as React from 'react';
import { Message } from 'semantic-ui-react';
import words from 'lodash-es/words';
import startCase from 'lodash-es/startCase';

export interface LoginErrorMessageProps {
  message: string;
}

export class LoginErrorMessage extends React.PureComponent<LoginErrorMessageProps> {
  render() {
    const { message } = this.props;
    if (words(message).length !== 0) {
      return (
        <Message error={true} icon="warning sign" content={startCase(message)} />
      );
    }
    return <div />;
  }
}
