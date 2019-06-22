export const types = {
  UPDATE_ERROR_MESSAGE: 'FRAME:ERROR_MESSAGE:UPDATE',
};

export const updateError = (action: any) => ({
  payload: {
    error: action.error,
  },
  type: types.UPDATE_ERROR_MESSAGE,
});
