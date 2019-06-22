export const types = {
  SELECT_CATEGORY: 'INTENT_EDITOR:INTENT_CATEGORY:SELECT_CATEGORY',
  RESET_CATEGORY: 'INTENT_EDITOR:INTENT_CATEGORY:RESET_CATEGORY',
};

export const selectCategory = (cat: string) => ({
  cat,
  type: types.SELECT_CATEGORY,
});

export const resetCategory = () => ({
  type: types.RESET_CATEGORY,
});
