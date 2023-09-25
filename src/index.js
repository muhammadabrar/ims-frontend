import React from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';


import './index.css';
import App from './App';
import ReactDOM from 'react-dom'
import { store } from './data/data'
import { Provider } from 'react-redux'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store} >
  <>
    <App  />
    </>
  </Provider>
);


