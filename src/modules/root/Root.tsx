import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
import isNil from 'lodash-es/isNil';
import { AuthRoute } from '../../components';
import { Login } from '../login';
import { Frame } from '../frame';
import { Conversation } from '../conversation';
import { ConnectedIntentEditor } from '../intent-editor';
import { DataAnalytics } from './../data-analytics';

interface RootProps {
  authenticated: boolean;
  validating: boolean;
  router: any;
}

const loginUrl = '/login';

class ProtectedModules extends React.PureComponent {
  render() {
    return (
      <Frame>
        <Switch>
          <Route path="/(conversation)?" exact={true} component={Conversation}/>
          <Route path="/intent" exact={true} component={ConnectedIntentEditor}/>
          <Route path="/data-analytics" component={DataAnalytics} />
          <Route component={NoMatch} />
        </Switch>
      </Frame>
    );
  }
}

class NoMatch extends React.PureComponent {
  render() {
    return (
      <p style={{ marginTop: '20%', fontSize: '4em', textAlign: 'center' }}>
        Page Not Found
      </p>
    );
  }
}

class Root extends React.PureComponent<RootProps> {
  componentWillMount() {
    const { authenticated } = this.props;
  }

  render() {
    const { authenticated, router } = this.props;
    return (
      <div>
        {
          (() => {
            if (!authenticated) {
              return (
                <Login />
              );
            }
          })()
        }
        <AuthRoute
          router={router}
          authenticated={authenticated}
          component={ProtectedModules}
        />
      </div>
    );
  }
}

export { RootProps, Root };
