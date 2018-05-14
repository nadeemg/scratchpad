//@flow
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Game from './Game.js';


//TODO autoplay
//TODO replay (speed?)
//TODO hide square values until revealed
//TODO num bombs settable
//TODO size of board settable
//TODO load init data? https://zhenyong.github.io/react/tips/initial-ajax.html
//TODO unit testing

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
