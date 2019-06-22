import * as React from 'react';
import { Menu, Icon, Popup, Checkbox, Input } from 'semantic-ui-react';
import * as styles from './styles.css';

export interface TopMenuProps {
  suspendAutoReply: boolean;
  fetchSuspendAutoReplyConfig: () => any;
  updateSuspendAutoReplyConfig: (value: boolean) => any;
  toggleSidebar: () => any;
  logout: () => any;
  push: (path: string) => any;
}

export class TopMenu extends React.PureComponent<TopMenuProps> {
  componentWillMount() {
    this.props.fetchSuspendAutoReplyConfig();
  }

  handlePush(path: string) {
    this.props.push(path);
  }

  render() {
    const { toggleSidebar, suspendAutoReply, logout } = this.props;
    const updateSuspendAutoReplyConfig = (e: any, data: any) => {
      this.props.updateSuspendAutoReplyConfig(!data.checked);
    };
    return (
      <Menu fixed="top" icon={true}>
        {/* <Menu.Item onClick={toggleSidebar}>
          <Icon name="content" size="large" />
        </Menu.Item> */}
        <Menu.Item>
          Lexica
          </Menu.Item>
        <Menu.Item>
          <Popup
            trigger={<Icon
              name="edit"
              link={true}
              size="large"
              onClick={this.handlePush.bind(this, '/intent')}
            />}
            content="Edit Response"
          />
        </Menu.Item>
        <Menu.Item>
          <Popup
            trigger={<Icon
              name="commenting"
              link={true}
              size="large"
              onClick={this.handlePush.bind(this, '/conversation')}
            />}
            content="Issue Conversation"
          />
        </Menu.Item>
        <Menu.Item position="right">
          <Popup
            trigger={
              <Checkbox
                toggle={true}
                checked={!suspendAutoReply}
                onChange={updateSuspendAutoReplyConfig}
              />
            }
            content="Toggle Chatbot Auto Reply"
          />
        </Menu.Item>
        <Menu.Item>
          <Popup
            trigger={
              <Icon
                name="area chart"
                link={true}
                size="large"
                onClick={this.handlePush.bind(this, '/data-analytics')}
              />
            }
            content="Data Analytics"
          />
        </Menu.Item>
        <Menu.Item>
          <Popup
            trigger={<Icon name="log out" link={true} size="large" onClick={logout} />}
            content="Log out"
          />
        </Menu.Item>
        {/* <Menu.Item>
            <Icon name="setting" />
          </Menu.Item> */}
      </Menu>
    );
  }
}
