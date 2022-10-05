import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { AppRoutes } from './routes';

import 'index.scss';

import 'react-multi-carousel/lib/styles.css';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<AppRoutes />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
