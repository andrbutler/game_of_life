import React, { Component } from 'react';
import Board from './containers/Board/Board';
import './App.css';

class App extends Component {
  render() {
      const style = {
        width: '100%',
        color: '#efefef',
        fontSize: '36px'
        };
    return (
      <div className="App">
        <h1 style={style}>Conway's Game Of Life</h1>
        <Board />
      </div>
    );
  }
}

export default App;
