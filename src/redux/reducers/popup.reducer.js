import { HIDE_POPUP, SHOW_POPUP } from "../Constants";

const initalState = {
  isShow: false,
};

const reducer = (state = initalState, { type }) => {
  switch (type) {
    case SHOW_POPUP:
      return { ...state, isShow: true };

    case HIDE_POPUP:
      return initalState;

    default:
      return state;
  }
};

export default reducer;
