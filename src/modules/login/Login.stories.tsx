import * as React from 'react';
import { storiesOf } from '@storybook/react';

import { default as Login } from './ConnectedLogin';

storiesOf('Login', module)
  .add('Default', () => <Login/>);
