export const types = {
  OPEN_CREATOR: 'INTENT_EDITOR:CREATOR:OPEN',
  CLOSE_CREATOR: 'INTENT_EDITOR:CREATOR:CLOSE',
  OPEN_CONFIRM: 'INTENT_EDITOR:CREATOR:CONFIRM:OPEN',
  CLOSE_CONFIRM: 'INTENT_EDITOR:CREATOR:CONFIRM:CLOSE',
  ASYNC_SUBMIT_REQUEST: 'INTENT_EDITOR:CREATOR:SUBMIT_REQUEST.ASYNC',
};

export const submitRequest = (formData: any) => ({
  payload: {
    ...formData,
  },
  type: types.ASYNC_SUBMIT_REQUEST,
});

export const openCreator = (subcat: string) => ({
  payload: subcat,
  type: types.OPEN_CREATOR,
});

export const closeCreator = () => ({
  type: types.CLOSE_CREATOR,
});

export const openConfirm = () => ({
  type: types.OPEN_CONFIRM,
});

export const closeConfirm = () => ({
  type: types.CLOSE_CONFIRM,
});
