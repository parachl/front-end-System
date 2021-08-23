import { combineReducers } from "redux";
import spinner from './Spinner.reducer';
import popup from './popup.reducer';


export default combineReducers({
    spinner,
    popup,
});