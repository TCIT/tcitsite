/**
*
* LoremIpsum
*
*/

import React, { PropTypes } from 'react';
import loremIpsum from 'lorem-ipsum';

/* eslint-disable react/no-danger */
function makeLorem({ count, units, paragraphClassName }) {
  const ipsum = loremIpsum({ count, units, format: 'html' });
  if (!paragraphClassName) {
    return ipsum;
  }

  return ipsum.replace(/<p/g, `<p class="${paragraphClassName}"`);
}


class LoremIpsum extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function

  static defaultProps = {
    component: 'section',
    count: 1,
    units: 'paragraphs',
  };

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.count !== nextProps.count || this.props.units !== nextProps.units) {
    }
  }

  render() {
    const { lorem } = this.state;
    const { component: Component, ...props } = this.props;
    delete props.count;
    delete props.units;
    delete props.paragraphClassName;

    return <Component {...props} dangerouslySetInnerHTML={{ __html: lorem }} />;
  }
}

LoremIpsum.propTypes = {
  className: PropTypes.string,
  paragraphClassName: PropTypes.string,
  component: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.string,
  ]).isRequired,
  count: PropTypes.number.isRequired,
  units: PropTypes.oneOf(['sentences', 'words', 'paragraphs']),
};

export default LoremIpsum;
