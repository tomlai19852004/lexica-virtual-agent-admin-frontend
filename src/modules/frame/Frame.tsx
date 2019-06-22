import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Link }  from 'react-router-dom';
import {
  Sidebar,
  Button,
  Container,
  Menu,
  Icon,
  Checkbox,
  Popup,
} from 'semantic-ui-react';

import { ConnectedErrorMessage } from './error-message';
import { ConnectedTopMenu } from './top-menu';

import * as styles from './styles.css';

interface FrameProps {
  sidebarVisibility: boolean;
  toggleSidebar: () => any;
  closeSidebar: () => any;
}

class Frame extends React.PureComponent<FrameProps> {
  render() {
    const { sidebarVisibility, toggleSidebar, closeSidebar } = this.props;
    return (
      <Container fluid={true}>
        <ConnectedTopMenu/>
        <Sidebar.Pushable className={styles.pushable}>
          <Sidebar
            as={Menu}
            animation="overlay"
            visible={sidebarVisibility}
            icon="labeled"
            vertical={true}
            width="wide"
            className={styles.sidebar}
            size="massive"
          >
            <Menu.Item as={Link} to="/intent" onClick={toggleSidebar}>
              <Icon name="edit"/>
              Edit Response
            </Menu.Item>
            <Menu.Item as={Link} to="/issue-conversation" onClick={toggleSidebar}>
              <Icon name="commenting"/>
              Issue Conversation (Option B)
            </Menu.Item>
            <Menu.Item as={Link} to="/issue-inbox" onClick={toggleSidebar}>
              <Icon name="inbox"/>
              Issue Inbox (Option A)
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher className={styles.pusher} onClick={closeSidebar}>
            {this.props.children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
        <ConnectedErrorMessage/>
      </Container>
    );
  }
}

export { FrameProps, Frame };
