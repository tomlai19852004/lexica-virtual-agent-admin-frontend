import { connect } from 'react-redux';
import { IntentCategory, IntentCategoryProps } from './IntentCategory';
import { selectCategory } from './Action';
import { updatePageStatus } from '../Action';

export default connect(
  (state: any) => ({
    categories: Object.keys(state.intentEditor.resources),
  }),
  { selectCategory, updatePageStatus },
)(IntentCategory);
