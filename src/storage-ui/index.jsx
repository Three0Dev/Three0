import React from 'react';
import { Provider } from 'react-redux';
import {configureStore} from '@reduxjs/toolkit'
import { composeWithDevTools } from 'redux-devtools-extension';

import Sidebar from './src/components/Sidebar';
import './src/assets/styles/App.scss';

import reducers from './src/reducers';
import { ViewFiles } from './src/pages';

import { BrowserRouter} from 'react-router-dom';

import generatedummyFileSystem from './src/utils/dummyFileSystem';

const store = configureStore({
  reducer: reducers,
  preloadedState:{
    fileSystem:
      localStorage.getItem('fileSystem') &&
      Object.keys(localStorage.getItem('fileSystem')).length > 0
        ? JSON.parse(localStorage.getItem('fileSystem'))
        : generatedummyFileSystem()
  },
  devTools: process.env.NODE_ENV === "development" ? composeWithDevTools() : false
});

export const StorageApp = () => {
    return (
        <Provider store={store}>
            <Sidebar />
            <ViewFiles />
        </Provider>
    );
}