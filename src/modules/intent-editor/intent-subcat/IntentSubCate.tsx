import * as React from 'react';
import { Button, Tab, Menu, Accordion, Icon } from 'semantic-ui-react';
import map from 'lodash-es/map';
import isNil from 'lodash-es/isNil';

import { ConnectedIntentList } from './intent-list';
import { PendingIntentList } from './pending-intent-list';
import * as styles from './styles.css';

export interface IntentSubCategoryProps {
  subCategories: {
    [subCategory: string]: any;
  };
  pendingItems: {
    [subCategory: string]: any;
  };
  openCreator: (subCat: string) => any;
}

export class IntentSubCategory extends React.PureComponent<IntentSubCategoryProps> {
  render() {
    const { subCategories, pendingItems, openCreator } = this.props;
    if (isNil(subCategories)) {
    // if no subCategories, that means user is not in a page of any category
    // and we dont need an empty tab with an ugly bottom line above the intentList
    // so we exit this component
      return false;
    }

    const panes = map(subCategories, (commands, subCategory) => {
      const hasPending = !isNil(pendingItems[subCategory]);
      const panels = [
        {
          title: (
            <b>Existing Intent</b>
          ),
          content: (
            <ConnectedIntentList commands={commands} subCategory={subCategory}/>
          ),
        },
      ];

      if (hasPending) {
        panels.push({
          title: (
            <b>Pending Intent</b>
          ),
          content: (
            <PendingIntentList pendingItems={pendingItems[subCategory]}/>
          ),
        });
      }

      return {
        menuItem: subCategory.toUpperCase(),
        render: () => (
          <Tab.Pane attached={false}>
            <Button
              fluid={true}
              content={'Create in ' + subCategory}
              onClick={openCreator.bind(null, subCategory)}
            />
            <Accordion defaultActiveIndex={0} panels={panels} />
          </Tab.Pane>
        ),
      };
    });

    return (
      <Tab
        menu={{
          secondary: true,
          pointing: true,
          className: `${styles.scroll} ${styles.scroll1}`,
        }}
        panes={panes}
      />
    );
  }
}
