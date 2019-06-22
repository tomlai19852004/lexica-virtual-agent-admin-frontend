import { connect } from 'react-redux';
import { Root, RootProps } from './Root';

export default connect(
  (state: any) => ({
    authenticated: state.login.authorizer.token.isAuthorized,
    router: state.router,
  }),
)(Root);
