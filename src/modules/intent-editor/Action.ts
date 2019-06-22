const types = {
  ASYNC_FETCH_RESOURCES: 'INTENT_EDITOR:FETCH_RESOURCES.ASYNC',
  ASYNC_FETCH_PENDING_RESOURCES: 'INTENT_EDITOR:FETCH_PENDING_RESOURCES.ASYNC',
  UPDATE_SEARCH_TERM: 'INTENT_EDITOR:UPDATE_SEARCH_TERM',
  UPDATE_PAGE_STATUS: 'INTENT_EDITOR:INTENT_CATEGORY:UPDATE_PAGE_STATUS',
};

const fetchResources = () => ({
  type: types.ASYNC_FETCH_RESOURCES,
});

const fetchPendingResources = () => ({
  type: types.ASYNC_FETCH_PENDING_RESOURCES,
});

const updateSearchTerm = (status: string) => ({
  type: types.UPDATE_SEARCH_TERM,
  payload: {
    status,
  },
});

const updatePageStatus = (status: string) => ({
  type: types.UPDATE_PAGE_STATUS,
  payload: {
    status,
  },
});

export {
  types,
  fetchResources,
  fetchPendingResources,
  updateSearchTerm,
  updatePageStatus,
};
