import * as React from 'react';
import { connect } from 'react-redux';
import mapValues from 'lodash-es/mapValues';
import defaultTo from 'lodash-es/defaultTo';

import { IntentSubCategory, IntentSubCategoryProps } from './IntentSubCate';
import { openCreator } from '../new-response-creator';

export default connect(
  (state: any) => {
    const { category, resources, pendingResources } = state.intentEditor;
    return {
      subCategories: resources[category],
      pendingItems: defaultTo(pendingResources[category], {}),
    };
  },
  { openCreator },
)(IntentSubCategory);
