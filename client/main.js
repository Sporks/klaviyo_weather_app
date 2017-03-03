import React from 'react';
import ReactDOM from 'react-dom';


//Use style similar to https://daveceddia.com/ajax-requests-in-react/

document.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    React.createElement(TrainSchedule),
    document.getElementById('mount')
  );
});
