/*
 *
 * NotificationCenter
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import Snackbar from 'react-md/lib/Snackbars';
import Button from 'react-md/lib/Buttons/Button';

import makeSelectNotificationCenter from './selectors';
import messages from './messages';
import { removeMessages } from './actions';

export class NotificationCenter extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * Notification Center
   *
   * This component is a common Notification Center for any action
   * It creates a `react-md` Snackbar when a dispatch action comes and shows a message.
   *
   * @param {string[]} notifications - this is an array of notifications.
   */
  render() {
    const messages = this.props.notifications;
    return (
      <Snackbar toasts={messages} autohide={true} onDismiss={this.props.onDissmiss} />
    );
  }
}

NotificationCenter.propTypes = {
  dispatch: PropTypes.func.isRequired,
  onDissmiss: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  notifications: makeSelectNotificationCenter(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onDissmiss: () => {
      dispatch(removeMessages());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationCenter);
