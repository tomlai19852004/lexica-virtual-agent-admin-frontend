import * as React from 'react';
import { Message, Sticky } from 'semantic-ui-react';
import startCase from 'lodash-es/startCase';
import isNil from 'lodash-es/isNil';
import '../../../../node_modules/izitoast/dist/css/iziToast.css';

const izitoast: any = require('izitoast');

export interface ErrorMessageProps {
  error: {
    message: string;
    errorMessageActive: boolean;
  };
}

export class ErrorMessage extends React.PureComponent<ErrorMessageProps> {
  render() {
    const { error: { message } } = this.props;
    if (!isNil(message)) {
      izitoast.error({
        title: 'Error',
        message: startCase(message),
        position: 'bottomLeft',
      });
    }
    return null;
  }
}
