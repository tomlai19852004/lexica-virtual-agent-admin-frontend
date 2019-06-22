import * as React from 'react';
import { Card, Segment } from 'semantic-ui-react';
import { IntentCard } from './intent-card';

export interface IntentCategoryProps {
  categories: string[];
  selectCategory: (cat: string) => any;
  updatePageStatus: (cat: string) => any;
}

export class IntentCategory extends React.PureComponent<IntentCategoryProps> {
  render() {
    const { categories, selectCategory, updatePageStatus } = this.props;

    return (
      <Card.Group itemsPerRow={3} as={Segment} basic={true}>
        {categories.sort().map((category) => {
          const updateAction = () => {
            selectCategory(category);
            updatePageStatus(category);
          };
          return (
            <IntentCard
              key={category}
              displayName={category}
              updateCategory={updateAction}
            />
          );
        })}
      </Card.Group>
    );
  }
}
