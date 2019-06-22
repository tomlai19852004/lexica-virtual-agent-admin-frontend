const types = {
  ASYNC_FETCHING_SUGGESTION:
    'ISSUE_CONVERSATION:MESSAGE_INPUT:SUGGESTED_ANSWER:GET_SUGGESTION.ASYNC',
  NEXT_SUGGESTION: 'ISSUE_CONVERSATION:MESSAGE_INPUT:SUGGESTED_ANSWER:NEXT_SUGGESTION',
  PREV_SUGGESTION: 'ISSUE_CONVERSATION:MESSAGE_INPUT:SUGGESTED_ANSWER:PREV_SUGGESTION',
  SELECT_SUGGESTION: 'ISSUE_CONVERSATION:MESSAGE_INPUT:SUGGESTED_ANSWER:SELECT_SUGGESTION',
  CLOSE_SUGGESTION_MODAL: 'ISSUE_CONVERSATION:MESSAGE_INPUT:SUGGESTED_ANSWER:CLOSE_SUGGESTION',
  OPEN_SUGGEST_SELECTOR: 'ISSUE_CONVERSATION:MESSAGE_INPUT:SUGGESTED_ANSWER:OPEN_SUGGEST_SELECTOR',
  TURN_OFF_STATUS_LOADING: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:TURN_OFF_STATUS_LOADING',
};

const fetchSuggestion = (msg: string, msgId: string) => ({
  type: types.ASYNC_FETCHING_SUGGESTION,
  payload: {
    msg,
    msgId,
  },
});

const openSuggestSelector = () => ({
  type: types.OPEN_SUGGEST_SELECTOR,
});

const selectSuggestion = (msg: string) => ({
  type: types.SELECT_SUGGESTION,
  payload: {
    msg,
  },
});

const closeSuggestionModal = () => ({
  type: types.CLOSE_SUGGESTION_MODAL,
});

const nextSuggestion = () => ({
  type: types.NEXT_SUGGESTION,
});

const prevSuggestion = () => ({
  type: types.PREV_SUGGESTION,
});

const turnOffStatusLoading = () => ({
  type: types.TURN_OFF_STATUS_LOADING,
});

export {
  types,
  fetchSuggestion,
  selectSuggestion,
  closeSuggestionModal,
  openSuggestSelector,
  turnOffStatusLoading,
};
