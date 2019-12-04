import React, { Component } from 'react';
import Header from './components/Commons/Header';

import './App.css'
import Dashboard from './components/Pages/Dashboard';


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Dashboard />
      </div>
    );
  }
}

export default App;
