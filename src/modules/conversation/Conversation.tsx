import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Button, Menu, Icon, Checkbox } from 'semantic-ui-react';
import * as styles from './styles.css';
import { List } from './list';
import { Thread } from './thread';
import { ThreadControl } from './thread-control';

class Issue extends React.PureComponent {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.container}>
          <List className={styles.left} />
          <div className={styles.right}>
            <Thread className={styles.display} />
            <ThreadControl className={styles.control} />
          </div>
        </div>
      </div>
    );
  }
}

export default Issue;
