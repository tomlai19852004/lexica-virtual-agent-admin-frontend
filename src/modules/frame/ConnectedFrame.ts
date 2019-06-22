import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import {
  toggleSidebar,
  closeSidebar,
} from './Actions';
import { Frame, FrameProps } from './Frame';

export default connect(
  (state: any) => ({
    sidebarVisibility: state.frame.sidebar.active,
  }),
  {
    toggleSidebar,
    closeSidebar,
  },
)(Frame);
