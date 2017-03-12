var style = require('./style/globalStyle.css');

var messages = require('./messages');

//ES6 Code
// import Button from './button';
// import i from './image';

// var newMsg = () => (`<p>${messages.greet} ${messages.event} ${i}</p>`);

import { mul } from './mathStuff';
const newMsg = () => (
  `<div class="${style.box}">
    DEV: ${DEVELOPMENT.toString()}<br>
    PROD: ${PRODUCTION.toString()}<br>
  </div>`
);

var app = document.getElementById('app');
app.innerHTML = newMsg();


// Used in HMR
if(module.hot) {
  module.hot.accept();
}
