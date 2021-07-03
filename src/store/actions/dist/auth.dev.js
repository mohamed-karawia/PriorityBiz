"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.changeSudo = exports.getSudo = exports.authCheckState = exports.authUser = exports.checkAuthTimeout = exports.changeSudoSuccess = exports.getSudoSuccess = exports.logout = exports.authFail = exports.authSuccess = exports.authStart = void 0;

var _axios = _interopRequireDefault(require("axios"));

var actionTypes = _interopRequireWildcard(require("./actionTypes"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var authStart = function authStart() {
  return {
    type: actionTypes.AUTH_START
  };
};

exports.authStart = authStart;

var authSuccess = function authSuccess(data) {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: data.token,
    role: data.role,
    username: data.username
  };
};

exports.authSuccess = authSuccess;

var authFail = function authFail(error) {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error
  };
};

exports.authFail = authFail;

var logout = function logout() {
  localStorage.clear();
  return {
    type: actionTypes.AUTH_LOGOUT
  };
};

exports.logout = logout;

var getSudoSuccess = function getSudoSuccess(data) {
  return {
    type: actionTypes.GET_SUDO_SUCCESS,
    data: data
  };
};

exports.getSudoSuccess = getSudoSuccess;

var changeSudoSuccess = function changeSudoSuccess(data) {
  return {
    type: actionTypes.CHANGE_SUDO_SUCCESS,
    data: data
  };
};

exports.changeSudoSuccess = changeSudoSuccess;

var checkAuthTimeout = function checkAuthTimeout(expireTime) {
  return function (dispatch) {
    setTimeout(function () {
      dispatch(logout());
    }, expireTime);
  };
};

exports.checkAuthTimeout = checkAuthTimeout;

var authUser = function authUser(data) {
  return function (dispatch) {
    dispatch(authStart());

    _axios.default.post('https://scms-api.herokuapp.com/auth/login', data).then(function (res) {
      console.log(res);
      var expirationDate = new Date(new Date().getTime() + res.data.data.token_expiresIn);
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('expirationDate', expirationDate);
      localStorage.setItem('role', res.data.data.role);
      localStorage.setItem('username', res.data.data.username);
      dispatch(authSuccess(res.data.data));
      dispatch(checkAuthTimeout(res.data.data.token_expiresIn));
    }).catch(function (err) {
      console.log(err.response);
      dispatch(authFail(err.response.data.message));
    });
  };
};

exports.authUser = authUser;

var authCheckState = function authCheckState() {
  return function (dispatch) {
    var auth = {
      token: localStorage.getItem('token'),
      role: localStorage.getItem('role'),
      username: localStorage.getItem('username')
    };

    if (!auth.token) {
      dispatch(logout());
    } else {
      var expirationDate = new Date(localStorage.getItem('expirationDate'));

      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        var sudoAuth = {
          token: localStorage.getItem('sudoToken'),
          userName: localStorage.getItem('sudoUsername')
        };

        if (!sudoAuth.token) {
          dispatch(authSuccess(auth));
        } else {
          dispatch(authSuccess(auth));
          dispatch(changeSudoSuccess(sudoAuth));
        }
      }
    }
  };
};

exports.authCheckState = authCheckState;

var getSudo = function getSudo() {
  return function (dispatch) {
    _axios.default.get('/user/sudo').then(function (res) {
      console.log(res);
      dispatch(getSudoSuccess(res.data.descount));
    }).catch(function (err) {
      console.log(err.response);
    });
  };
};

exports.getSudo = getSudo;

var changeSudo = function changeSudo(id) {
  return function (dispatch) {
    _axios.default.post('/user/sudo', {
      id: id
    }).then(function (res) {
      console.log(res);
      localStorage.setItem('sudoToken', res.data.data.token);
      localStorage.setItem('sudoUsername', res.data.data.userName);
      dispatch(changeSudoSuccess(res.data.data));
    }).catch(function (err) {
      console.log(err);
    });
  };
};

exports.changeSudo = changeSudo;