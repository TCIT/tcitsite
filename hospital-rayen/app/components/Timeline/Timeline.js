/**
*
* Timeline
*
*/

import React from 'react';

import './_timeline.scss';

class Timeline extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <div className="timeline">
        <h2>2017</h2>

        <ul>
          <li>
            <h3>Test 1</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <time>Junio 2017</time>
          </li>
          <li>
            <h3>Test 2</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <time>Abril 2017</time>
          </li>
          <li>
            <h3>Testing timeline</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <time>Enero 2017</time>
          </li>
          <li>
            <h3>Testing</h3>
            <p>I moved to <a href="#">Ames, Iowa</a> and settled down into my new life.</p>
            <time>Febrero 2017</time>
          </li>
        </ul>

        <h2>2016</h2>
        <ul>
          <li>
            <h3>Evento 1</h3>
            <p>It only took, like, two years.</p>
            <time>December 2012</time>
          </li>
          <li>
            <h3>Evento 2</h3>
            <p>Studying Aerospace Engineering.</p>
            <time>May 2012</time>
          </li>
        </ul>
      </div>
    );
  }
}

Timeline.propTypes = {

};

export default Timeline;
