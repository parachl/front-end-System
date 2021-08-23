import { HIDE_POPUP, SHOW_POPUP } from "../constants/Constants";

const initalState = {
  isShow: false,
  title: "",
  description: "",
  action: () => {},
};

const reducer = (state = initalState, { type, payload }) => {
  switch (type) {
    case SHOW_POPUP:
      return { ...state, ...payload, isShow: true };

    case HIDE_POPUP:
      return initalState;

    default:
      return state;
  }
};

export default reducer;
