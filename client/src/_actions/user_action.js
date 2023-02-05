import axios from "axios";
import {
  API,
  LOGIN_USER, 
  REGISTER_USER, 
  LOGOUT_USER, 
  AUTH_USER
} from './types';

export function loginUser(body) {
  const result = axios.post(API+'/user/login', body, {withCredentials: true}).then(response => response.data);
    
  return {
    type: LOGIN_USER,
    payload: result
  }
}

export function registerUser(body) {
  const result = axios.post(API+'/user/register', body, {withCredentials: true}).then(response => response.data);
    
  return {
    type: REGISTER_USER,
    payload: result
  }
}

export function logoutUser() {
  const result = axios.get(API+'/user/logout', {withCredentials: true}).then(response => response.data);
                   
  return {
    type: LOGOUT_USER,
    payload: result
  }
}

export function auth() {
  const result = axios.get(API+'/user/auth', {withCredentials: true}).then(response => response.data);
                   
  return {
    type: AUTH_USER,
    payload: result
  }
}