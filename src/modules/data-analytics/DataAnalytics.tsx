import * as React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Menu } from './menu';
import { Traffic } from './traffic';
import { AutoReplyComment } from './auto-reply-comment';
import { Container } from 'semantic-ui-react';

interface DataAnalyticsProps {
  match: {
    url: string;
  };
}

class DataAnalytics extends React.PureComponent<DataAnalyticsProps> {
  render() {
    const { match: { url } } = this.props;
    return (
      <div>
        <Menu baseUrl={url} />
        <Container fluid={true} style={{ padding: '1em' }}>
          <Switch>
            <Route path={`${url}/traffic`} component={Traffic} />
            <Route path={`${url}/auto-reply-comment`} component={AutoReplyComment} />
            <Redirect to={`${url}/traffic`} />
          </Switch>
        </Container>
      </div>
    );
  }
}

export {
  DataAnalytics,
};
