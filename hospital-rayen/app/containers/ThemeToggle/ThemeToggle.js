/*
 *
 * ThemeToggle
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import { injectIntl, intlShape } from 'react-intl';
import Toggle from 'components/Toggle';
import messages from './messages';
import { changeTheme } from 'containers/App/actions';
import makeSelectSession from '../Session/selectors';
import { reselectObjects } from '../App/selectors';

const themes = [
  'rayen',
  'nexus',
];

export class ThemeToggle extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    const {theme} = this.props.theme;
    const {intl} = this.props;
    return (
      <Toggle label={intl.formatMessage(messages.labelselecttheme)} value={theme} values={themes} messages={messages} onToggle={this.props.onThemeToggle} />
    );
  }
}

ThemeToggle.propTypes = {
  onThemeToggle: React.PropTypes.func,
  theme: React.PropTypes.any,
  intl: intlShape.isRequired,
};

const mapStateToProps = createStructuredSelector({
  session: makeSelectSession(),
  objects: reselectObjects(),
});

export function mapDispatchToProps(dispatch) {
  return {
    onThemeToggle: (evt) => dispatch(changeTheme(evt)),
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ThemeToggle));
