import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ConnectedFrame from './ConnectedFrame';

storiesOf('Frame', module)
  .add('Default', () => <ConnectedFrame/>);
