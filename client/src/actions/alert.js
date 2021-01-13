import {v4 as uuidv4} from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    // get random universal id
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    });

    // remove alert sign 5 seconds after the alert sign is displayed. 
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout); 
}

