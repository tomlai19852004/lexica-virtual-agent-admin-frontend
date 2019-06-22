import { connect } from 'react-redux';

import { validateUser } from './login-form/Actions';
import { Login } from './Login';

const connectedLogin = connect(
  (state: any) => ({
    validating: state.login.authorizer.validating,
  }),
  { validateUser },
)(Login);

export default connectedLogin;
