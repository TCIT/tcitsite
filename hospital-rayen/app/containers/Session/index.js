import React from 'react';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { reselectObjects } from '../App/selectors';
import { makeSelectSession } from './selectors';
import * as sessionActions from './actions';
import SessionList from 'components/SessionList';
import SessionLogin from 'components/SessionLogin';
import SessionPassword from 'components/SessionPassword';
import SessionRole from 'components/SessionRole';
import { bindActionCreators } from 'redux';

class SessionsPage extends React.PureComponent {
  render() {
    const { actions, changeRoute, session, objects } = this.props;
    const { loginAjaxState, changePasswordAjaxState, controls, error, loginSessionId } = session;
    const activeSessionId = this.props.session.activeSessionId;
    const sessions = Object.values(objects.sessions);
    const users = Object.values(objects.users);
    const activeSession = activeSessionId ? objects.sessions[activeSessionId] : null;
    const activeUser = activeSession ? activeSession.user() : null;
    const logingSession = loginSessionId ? objects.sessions[loginSessionId] : null;
    const facilities =Object.values(this.props.objects.facilities);
    const roles =Object.values(this.props.objects.roles);
    switch (this.props.session.step) {
      case 1:
        return (
          <SessionList
            controls={controls}
            actions={actions}
            changeRoute={changeRoute}
            sessions={sessions}
            users={users}
            activeSession={activeSession}
            activeUser={activeUser}
            facilities={facilities}
            roles={roles}
          />
        );
      case 2: {
        return (
          <SessionLogin
            actions={actions}
            controls={controls}
            error={error}
            ajaxState={loginAjaxState}
          />
        );
      }
      case 3:{
        return (
          <SessionPassword
            activeSession={this.props.session.activeSessionData}
            actions={actions}
            controls={controls}
            error={error}
            ajaxState={changePasswordAjaxState}
          />
        );
      }
      case 4:
        return (
          <SessionRole
            activeSessionData={this.props.session.activeSessionData}
            actions={actions}
            controls={controls}
            logingSession={logingSession}
            error={error}
          />
        );
      default:
        return null;
    }
  }
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(sessionActions, dispatch),
    changeRoute: (url) => dispatch(push(url))
  };
}
const mapStateToProps = createStructuredSelector({
  session: makeSelectSession(),
  objects: reselectObjects()
});

export default connect(mapStateToProps, mapDispatchToProps)(SessionsPage);
