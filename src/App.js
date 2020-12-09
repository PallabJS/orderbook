import React from 'react';

import './App.css';

import Clock from './components/Clock';
import Orderbook from './components/Orderbook';
import Placeorder from './components/Placeorder';

function App() {
  return (
    <div className="App">
      <div className="app_container">

        <div className="app_header">
          <div>
            <Clock />
          </div>
          <h2> Order Book </h2>
        </div>

        <Placeorder />

        <div className="app_main">
          <Orderbook />
        </div>

      </div>
    </div>
  );
}

export default App;