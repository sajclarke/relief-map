import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class About extends Component {
  render() {
    return (
      <div className='App'>
        <h1>About</h1>

        <p>
          This project was inspired by
          <a href='http://www.relieftt.org'>Relief TT</a>. The source code can
          be found on Github
          <a href='https://github.com/sajclarke/relief-map'>here</a>
        </p>
      </div>
    );
  }
}
export default About;
