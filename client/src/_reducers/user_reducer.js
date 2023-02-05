import {
  LOGIN_USER, 
  REGISTER_USER, 
  LOGOUT_USER, 
  AUTH_USER
} from '../_actions/types';

export function user(state = {userData: {isAuth: false}, loginSuccess: {success: false}, authCheck: false}, action) {
  switch(action.type) {
    case LOGIN_USER:
      return {...state, loginSuccess: action.payload, authCheck: false};
    case REGISTER_USER:
      return {...state, register: action.payload};
    case LOGOUT_USER:
      return {...state, loginSuccess: {success: false}, authCheck: false};
    case AUTH_USER:
      return {...state, userData: action.payload, authCheck: true};
    default:
      return state;
  }
}