import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Conversation from './Conversation';

storiesOf('Issue', module)
  .add('Default', () => <Conversation />);
