import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ToastContainer } from 'react-toastify';
import * as serviceWorker from './serviceWorker';

import App from './App';

import client from './apollo/client';

import './index.scss';
import 'react-toastify/dist/ReactToastify.min.css';

/* eslint-disable react/jsx-filename-extension */
ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
    <ToastContainer position="bottom-left" />
  </ApolloProvider>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
