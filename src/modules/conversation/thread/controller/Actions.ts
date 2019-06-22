import { InputOnChangeData } from 'semantic-ui-react';

const types = {
  ASYNC_APPLY_CHANGES:
    'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:ASYNC_APPLY_CHANGES',
  SELECT_MESSAGE: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:SELECT_MESSAGE',
  CLEAR_MESSAGE_SELECTIONS:
    'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:CLEAR_MESSAGE_SELECTIONS',
  TOGGLE_MODE: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:TOGGLE_MODE',
  DISMISS_DONE: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:DISMISS_DONE',
  START_SEARCH: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:START_SEARCH',
  UPDATE_SEARCH_MESSAGE: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:UPDATE_SEARCH_MESSAGE',
  CLEAR_SEARCH: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:CLEAR_SEARCH',
  DONE_SEARCH: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:DONE_SEARCH',
  UPDATE_HIGHLIGHT: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:UPDATE_HIGHLIGHT',
  PREV_MATCH: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:PREV_MATCH',
  NEXT_MATCH: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:NEXT_MATCH',
  SEARCH_NOT_FOUND: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:SEARCH_NOT_FOUND',
  RESET_NOT_STATUS: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:CONTROLLER:RESET_NOT_STATUS',
};

const selectMessage = (message: any) => ({
  type: types.SELECT_MESSAGE,
  payload: {
    message,
  },
});

const clearMessageSelections = () => ({
  type: types.CLEAR_MESSAGE_SELECTIONS,
});

const applyChanges = (mode: string, requests: any, responses: any) => ({
  payload: {
    mode,
    requests,
    responses,
  },
  type: types.ASYNC_APPLY_CHANGES,
});

const toggleMode = (mode: string) => ({
  type: types.TOGGLE_MODE,
  payload: {
    mode,
  },
});

const startSearch = (data: InputOnChangeData) => ({
  type: types.START_SEARCH,
  payload: {
    value: data.value,
  },
});

const clearSearch = () => ({
  type: types.CLEAR_SEARCH,
});

const nextMatch = () => ({
  type: types.NEXT_MATCH,
});

const prevMatch = () => ({
  type: types.PREV_MATCH,
});

export {
  types,
  selectMessage,
  clearMessageSelections,
  applyChanges,
  toggleMode,
  startSearch,
  clearSearch,
  nextMatch,
  prevMatch,
};
