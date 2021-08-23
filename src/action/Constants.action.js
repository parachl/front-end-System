import { SHOW_SPINNER } from '../constants/Constants';
import { HIDE_LOADER } from '../constants/Constants';
import { CHECK_PERMISSION } from '../constants/Constants';


export const showSpinner = () => ({
    type:SHOW_SPINNER,
});

export const hideSpinner = () => ({
    type:HIDE_LOADER,
});

export const checkPermission = () => ({
    type:CHECK_PERMISSION,
});

