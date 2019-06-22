import { connect } from 'react-redux';
import { MessageController, MessageControllerProps } from './MessageController';
import {
  toggleMode,
  clearMessageSelections,
  applyChanges,
  startSearch,
  clearSearch,
  nextMatch,
  prevMatch,
} from './Actions';
import { openEmailSender } from '../../thread-control/email-sender/Actions';

const connectedMessageController = connect(
  (state: any) => ({
    selectedMessages: state.conversation.thread.controller.selectedMessages,
    currentMode: state.conversation.thread.controller.mode,
    status: state.conversation.thread.controller.status,
    searchTerm: state.conversation.thread.controller.searchTerm,
    searchDone: state.conversation.thread.controller.searchDone,
    searchNotFound: state.conversation.thread.controller.searchNotFound,
  }),
  {
    toggleMode,
    clearMessageSelections,
    applyChanges,
    openEmailSender,
    startSearch,
    clearSearch,
    nextMatch,
    prevMatch,
  },
)(MessageController);

export default connectedMessageController;
