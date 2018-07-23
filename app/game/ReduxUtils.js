let reduxDispatch;

export const setDispatch = (dispatch) => reduxDispatch = dispatch;
export const dispatch = (...args) => reduxDispatch(...args);
