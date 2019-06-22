export const types = {
  ASYNC_UPDATE_RESPONSE: 'INTENT_EDITOR:RESPONSE_EDITOR:UPDATE_RESPONSE.ASYNC',
  START_EDIT: 'INTENT_EDITOR:RESPONSE_EDITOR:START_EDIT',
  CANCEL_EDIT: 'INTENT_EDITOR:RESPONSE_EDITOR:CANCEL_EDIT',
  ASYNC_DELETE_RESPONSE: 'INTENT_EDITOR:RESPONSE_EDITOR:DELETE_RESPONSE.ASYNC',
};

export const updateResponse = (sampleQuestion: string, formData: object) => ({
  type: types.ASYNC_UPDATE_RESPONSE,
  payload: {
    ...formData,
    originSampleQuestion: sampleQuestion,
  },
});

export const startEdit = (command: string, category: string) => ({
  type: types.START_EDIT,
  payload: {
    command,
    category,
  },
});

export const cancelEdit = () => ({
  type: types.CANCEL_EDIT,
});

export const deleteResponse = (responseName: string) => ({
  type: types.ASYNC_DELETE_RESPONSE,
  payload: {
    responseName,
  },
});
