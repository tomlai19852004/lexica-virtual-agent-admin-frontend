import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import {
  toggleSidebar,
  fetchSuspendAutoReplyConfig,
  updateSuspendAutoReplyConfig,
} from '../Actions';
import { logout } from '../../login/login-form/Actions';

import { TopMenuProps, TopMenu } from './TopMenu';

export default connect(
  (state: any) => ({
    suspendAutoReply: state.frame.suspendAutoReply,
  }),
  {
    fetchSuspendAutoReplyConfig,
    updateSuspendAutoReplyConfig,
    toggleSidebar,
    push,
    logout,
  },
)(TopMenu);
