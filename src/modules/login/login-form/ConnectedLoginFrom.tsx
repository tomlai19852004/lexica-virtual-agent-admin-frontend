import { connect } from 'react-redux';
import { ConfigProps, DecoratedComponentClass, reduxForm } from 'redux-form';
import { LoginForm, LoginFormProps } from './LoginForm';
import { loginRequest, fetchTokenTypes } from './Actions';

const fromConnectedLoginForm = reduxForm({
  form: 'login:loginForm',
})(LoginForm);

const connectedLoginForm = connect<any, any, any, any>(
  (state: any) => ({
    unis: state.login.authorizer.tokenTypes,
    authToken: state.login.authorizer.token.token,
  }),
  { loginRequest, fetchTokenTypes },
  (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
    fetchTokenTypes: dispatchProps.fetchTokenTypes,
    onSubmit: dispatchProps.loginRequest,
  }),
)(fromConnectedLoginForm);

export default connectedLoginForm;
