import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import axios from 'axios';

import thunk from 'redux-thunk';

import inventoryReducer from './store/reducers/inventory';
import recipientsReducer from './store/reducers/recipients';
import authReducer from './store/reducers/auth'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  inventory: inventoryReducer,
  recipients: recipientsReducer,
  auth: authReducer
})

const store = createStore(rootReducer, composeEnhancers(
  applyMiddleware(thunk)
));

axios.defaults.baseURL = 'https://scms-api.herokuapp.com';
axios.defaults.headers.common['Authorization'] = `auth ${localStorage.getItem('token')}`;


ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
