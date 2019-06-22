const types = {
  ASYNC_FETCH_SUSPEND_AUTO_REPLY_CONFIG: 'FRAME:FETCH_SUSPEND_AUTO_REPLY_CONFIG.ASYNC',
  ASYNC_UPDATE_SUSPEND_AUTO_REPLY_CONFIG: 'FRAME:ASYNC_UPDATE_SUSPEND_AUTO_REPLY_CONFIG',
  TOGGLE_SIDEBAR: 'FRAME:TOGGLE_SIDEBAR',
  CLOSE_SIDEBAR: 'FRAME:CLOSE_SIDEBAR',
};

const fetchSuspendAutoReplyConfig = () => ({
  type: types.ASYNC_FETCH_SUSPEND_AUTO_REPLY_CONFIG,
});

const updateSuspendAutoReplyConfig = (value: boolean) => ({
  value,
  type: types.ASYNC_UPDATE_SUSPEND_AUTO_REPLY_CONFIG,
});

const toggleSidebar = () => ({
  type: types.TOGGLE_SIDEBAR,
});

const closeSidebar = () => ({
  type: types.CLOSE_SIDEBAR,
});

export {
  types,
  fetchSuspendAutoReplyConfig,
  updateSuspendAutoReplyConfig,
  toggleSidebar,
  closeSidebar,
};
