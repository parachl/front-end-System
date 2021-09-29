import { SHOW_SPINNER,HIDE_LOADER } from "../Constants";


const initalState = {
    isShow:false ,
}

const reducer = (state = initalState,{type}) => {
      switch (type) {
          case SHOW_SPINNER:
               return {...state,isShow:true};
          case HIDE_LOADER:
               return { ...state, isShow: false };

          default:
           return state;
      }


};

export default reducer;
