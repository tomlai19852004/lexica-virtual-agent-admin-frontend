import * as React from 'react';
import { Accordion, List,  Divider, Icon, Label, Popup } from 'semantic-ui-react';
import map from 'lodash-es/map';
import first from 'lodash-es/first';
import at from 'lodash-es/at';

export interface PendingIntentListProps {
  pendingItems: {
    [id: string]: {
      sampleQuestion: string;
      responses: any[];
    };
  };
}

export class PendingIntentList extends React.PureComponent<PendingIntentListProps> {
  render() {
    const { pendingItems } = this.props;
    const listItem = map(pendingItems, (item) => {
      const response = at(first(item.responses), 'messages[0].en-GB');
      return (
        <List.Item key={Date.now()}>
          <List.Content>
            <Popup
              trigger={<div>{item.sampleQuestion}</div>}
              content={`Response: ${response}`}
              position="top left"
            />
          </List.Content>
        </List.Item>
      );
    });

    return (
      <List divided={true}>
        {listItem}
      </List>
    );
  }
}
