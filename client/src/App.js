import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
// import './App.css';
import About from './pages/About';
import List from './pages/List';

class App extends Component {
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={List} />
          <Route path='/about' component={About} />
        </Switch>
      </div>
    );
    return (
      <Switch>
        <App />
      </Switch>
    );
  }
}

export default App;
