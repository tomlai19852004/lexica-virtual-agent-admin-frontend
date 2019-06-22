import * as React from 'react';
import { storiesOf } from '@storybook/react';
import ConnectedMenu from './ConnectedMenu';

storiesOf('data-analytics', module)
    .add('Default', () => <ConnectedMenu baseUrl="/data-analytics" />);
