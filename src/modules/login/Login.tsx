import * as React from 'react';
import { Grid, Message, Header, MessageProps, Icon } from 'semantic-ui-react';

import { ConnectedLoginForm } from './login-form';
import { ConnectedLoginErrorMessage } from './login-error-message';
import * as styles from './styles.css';

interface LoginProps {
  validating: boolean;
  validateUser: () => any;
}

class Login extends React.PureComponent<LoginProps> {
  componentWillMount() {
    this.props.validateUser();
  }
  render() {
    const { validating } = this.props;
    let jsx;
    if (validating) {
      jsx = (
        <div className={styles.loading}>
          <Icon loading={true} name="spinner" size="massive" />
        </div>
      );
    } else {
      jsx =  (
        <Grid textAlign="center" verticalAlign="middle" className={styles.gridCenter}>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as="h2" color="teal" textAlign="center">
              Log-in to your account
            </Header>
            <ConnectedLoginForm />
            <ConnectedLoginErrorMessage />
          </Grid.Column>
        </Grid>
      );
    }
    return jsx;
  }
}

export { LoginProps, Login };
