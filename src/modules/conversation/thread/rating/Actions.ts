const types = {
  ASYNC_SUBMIT_REVIEW: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:RATING:SUBMIT_REVIEW.ASYNC',
  OPEN_RATING: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:RATING:OPEN_RATING',
  CLOSE_RATING: 'ISSUE_CONVERSATION:MESSAGE_DISPLAY:RATING:CLOSE_RATING',
};

const openRating = (messageInd: number) => ({
  type: types.OPEN_RATING,
  payload: {
    messageInd,
  },
});

const closeRating = () => ({
  type: types.CLOSE_RATING,
});

const submitReview = (id: string, messageId: string, data: any) => ({
  type: types.ASYNC_SUBMIT_REVIEW,
  payload: {
    id,
    messageId,
    data: {
      comment: {
        rating: data.newType ? undefined : data.rate,
        newType: data.newType,
        text: data.comment,
      },
    },
  },
});

export {
  types,
  openRating,
  closeRating,
  submitReview,
};
