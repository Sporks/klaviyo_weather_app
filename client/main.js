import React from 'react';
import ReactDOM from 'react-dom';
import Signup from './Signup'


//Use style similar to https://daveceddia.com/ajax-requests-in-react/

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(Signup),
    document.getElementById('mount')
  );
});
