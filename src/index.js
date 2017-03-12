var style = require('./style/globalStyle.css');

import $ from 'jquery';

var app = document.getElementById('app');
app.innerHTML = `
  <div id="menu">
    <button id="loadpage1">Load Page 1</button>
    <button id="loadpage2">Load Page 2</button>
  </div>
  <div id="content">
    <h1>Home</h1>
  </div>
`;

document.getElementById('loadpage1').addEventListener('click', () => {
  System.import('./page1').then(pageModule => { //lazyloading Module on click using System.import() - alt for import/require
    document.getElementById('content').innerHTML = pageModule.default;
  })
});
document.getElementById('loadpage2').addEventListener('click', () => {
  System.import('./page2').then(pageModule => { //lazyloading Module on click using System.import() - alt for import/require
    document.getElementById('content').innerHTML = pageModule.default;
  })
});

$('#app').css('background-color', 'white');

// Used in HMR
if(module.hot) {
  module.hot.accept();
}
