import React from 'react';
import { shallow } from 'enzyme';

import App from '../App';
import AppWrapper from 'containers/AppWrapper'

describe('<App />', () => {
  it('should render its children', () => {
    const children = (<AppWrapper />);
    const renderedComponent = shallow(
      <App>
        {children}
      </App>
    );
    expect(renderedComponent.contains(children)).toBe(true);
  });
});
