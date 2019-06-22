import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { default as ConnectedIntentEditor } from './ConnectedIntentEditor';

storiesOf('InterEditor', module)
  .add('Default', () => <ConnectedIntentEditor/>);
