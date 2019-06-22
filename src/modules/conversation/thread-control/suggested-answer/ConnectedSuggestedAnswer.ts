import { connect } from 'react-redux';
import { change } from 'redux-form';

import { SuggestedAnswer } from './SuggestedAnswer';
import { selectSuggestion, closeSuggestionModal } from './Action';

export default connect(
  (state: any) => ({
    suggestions: state.conversation.suggest.suggestions,
    suggestionIndex: state.conversation.suggest.counter,
    message: state.conversation.suggest.message,
    status: {
      open: state.conversation.suggest.status.open,
      loading: state.conversation.suggest.status.loading,
    },
    selectedConversation: state.conversation.list.selectedConversation,
  }),
  {
    selectSuggestion,
    closeSuggestionModal,
  },
)(SuggestedAnswer);
