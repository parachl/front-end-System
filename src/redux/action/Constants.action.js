import { SHOW_SPINNER } from '../Constants';
import { HIDE_LOADER } from '../Constants';
import { CHECK_PERMISSION } from '../Constants';
import { SHOW_POPUP } from '../Constants';
import { HIDE_POPUP } from '../Constants';


export const showSpinner = () => ({
    type:SHOW_SPINNER,
});

export const hideSpinner = () => ({
    type:HIDE_LOADER,
});

export const checkPermission = () => ({
    type:CHECK_PERMISSION,
});

export const showPopup = (payload) => ({
    type: SHOW_POPUP,
    payload,
  });
  
  export const hidePopup = () => ({
    type: HIDE_POPUP,
  });

