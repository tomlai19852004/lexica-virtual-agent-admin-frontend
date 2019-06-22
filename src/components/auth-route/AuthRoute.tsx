import * as React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { api } from '../../commons/Api';

interface AuthRouteProps {
  component: any;
  authenticated: boolean;
  [key: string]: any;
}

class AuthRoute extends React.PureComponent<AuthRouteProps> {
  render() {
    const { component, authenticated, redirectUrl, ...rest } = this.props;
    if (authenticated) {
      return (
        <Route component={component} {...rest} />
      );
    }
    return null;
  }
}

export {
  AuthRouteProps,
  AuthRoute,
};
