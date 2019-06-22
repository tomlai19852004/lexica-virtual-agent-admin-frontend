import * as React from 'react';
import { Card, Button, Icon } from 'semantic-ui-react';
import startCase from 'lodash-es/startCase';
import capitalize from 'lodash-es/capitalize';

interface IntentCardProps {
  displayName: string;
  updateCategory: () => any;
}

class IntentCard extends React.PureComponent<IntentCardProps> {
  render() {
    const { displayName, updateCategory } = this.props;
    return (
      <Card raised={true}>
        <Card.Content
          as={Button}
          fluid={true}
          basic={true}
          size="massive"
          onClick={updateCategory}
        >
          <h1>{startCase(capitalize(displayName))}</h1>
        </Card.Content>
      </Card>
    );
  }
}

export { IntentCardProps, IntentCard };
