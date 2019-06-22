import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { Icon, Menu as SMenu, Grid } from 'semantic-ui-react';

interface MenuProps {
  router: any;
  baseUrl: string;
  push: (path: string) => any;
}

class Menu extends React.PureComponent<MenuProps> {

  private items: any;

  constructor(props: MenuProps) {
    super(props);
    this.items = [
      {
        name: 'Infographics',
        logo: 'pie chart',
        path: '/infographics',
        disabled: true,
      },
      {
        name: 'Traffic',
        logo: 'car',
        path: '/traffic',
      },
      {
        name: 'Auto Reply',
        logo: 'star',
        path: '/auto-reply-comment',
      },
      {
        name: 'Volume',
        logo: 'database',
        path: '/volume',
        disabled: true,
      },
      {
        name: 'Specificity',
        logo: 'cube',
        path: '/specificity',
        disabled: true,
      },
      {
        name: 'Library Service',
        logo: 'file text',
        path: '/library-service',
        disabled: true,
      },
      {
        name: 'Special Class',
        logo: 'folder open',
        path: '/special-class',
        disabled: true,
      },
      {
        name: 'User Satisfaction',
        logo: 'like outline',
        path: '/user-satisfaction',
        disabled: true,
      },
      {
        name: 'Automation',
        logo: 'android',
        path: '/automation',
        disabled: true,
      },
      {
        name: 'Duration',
        logo: 'clock',
        path: '/duration',
        disabled: true,
      },
    ].map((item: any) => {
      (item as any).onClick = this.toPath.bind(this, item.path, item.disabled);
      return item;
    });
  }

  toPath(path: string, disabled: boolean) {
    const { baseUrl, push } = this.props;
    if (!disabled) {
      push(`${baseUrl}${path}`);
    }
  }

  render() {
    const { router, baseUrl } = this.props;
    return (
      <SMenu icon="labeled" widths="10">{
        this.items.map((item: any, i: number) =>
          <SMenu.Item
            key={i}
            onClick={item.onClick}
            active={router.location.pathname === `${baseUrl}${item.path}`}
            disabled={item.disabled}
          >
            <Icon name={item.logo} />
            {item.name}
          </SMenu.Item>,
        )
      }</SMenu>
    );
  }
}

export { MenuProps, Menu };
