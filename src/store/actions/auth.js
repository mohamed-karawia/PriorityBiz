import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';
import * as actionTypes from './actionTypes';


export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (data) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: data.token,
        role: data.role
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error
    }
}

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('role')
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = (expireTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expireTime)
    }
}


export const authUser = (data) => {
    return dispatch => {
        dispatch(authStart())
        axios.post('https://scms-api.herokuapp.com/auth/login', data)
        .then(res => {
            console.log(res);
            const expirationDate = new Date(new Date().getTime() + res.data.data.token_expiresIn);
            localStorage.setItem('token', res.data.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('role', res.data.data.role);
            dispatch(authSuccess(res.data.data))
            dispatch(checkAuthTimeout(res.data.data.token_expiresIn));
        })
        .catch(err => {
            console.log(err.response)
            dispatch(authFail(err.response.data.message))
        })
    }
}

export const authCheckState = () => {
    return dispatch => {
        const auth = {
            token :localStorage.getItem('token'),
            role : localStorage.getItem('role')
        }
        if (!auth.token){
            dispatch(logout());
        }else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()){
                dispatch(logout());
            }else {

                dispatch(authSuccess(auth))

            }
        }
    }
}
