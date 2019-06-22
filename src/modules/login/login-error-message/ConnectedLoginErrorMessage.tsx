import { connect } from 'react-redux';

import { LoginErrorMessage, LoginErrorMessageProps } from './LoginErrorMessage';

export default connect(
  (state: any) => ({
    message: state.login.authorizer.error,
  }),
)(LoginErrorMessage);
