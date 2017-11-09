import React from 'react';
import Avatar from 'react-md/lib/Avatars';
import Divider from 'react-md/lib/Dividers';
import FontIcon from 'react-md/lib/FontIcons';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import Subheader from 'react-md/lib/Subheaders';
import toInitials from 'utils/StringUtils/toInitials';
import SessionLogo from 'components/SessionLogo';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const getName = healthCarePractitioner => {
  return `${healthCarePractitioner.firstGivenName} ${healthCarePractitioner.firstFamilyName}`;
}

const SessionListItem = ({ session, actions, initials, forget }) => {
  const userData = JSON.parse(session.userData);
  return (
    <div className='row'>
      <div className='col-xs-10'>
        <ListItem
          key={session.id}
          className="session-listitem"
          primaryText={getName(userData.healthCarePractitioner)}
          secondaryText={session.token ? 'Sesión iniciada' : 'Cerró sesión'}
          onClick={session.token ? () => actions.resumeSession(session.id) : () => actions.signUp(session.id, userData.user)}
          leftAvatar={
            <Avatar src={userData.avatarUrl} role="presentation">
              {initials(userData.healthCarePractitioner.firstGivenName)}
            </Avatar>
          }
        />
      </div>
      <div className='col-xs-2'>
        <FontIcon
          className="session-listitem--close"
          onClick={() => forget(session.id)}
          style={{cursor: 'pointer'}}
        >
          close
        </FontIcon>
      </div>
    </div>
  )
}

const ExpandibleSubheader = ({ text, expanded, action }) => {
  return (
    <Subheader primaryText={text} style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      {expanded && <FontIcon onClick={action} style={{cursor: 'pointer'}}>expand_less</FontIcon>}
      {!expanded && <FontIcon onClick={action} style={{cursor: 'pointer'}}> expand_more</FontIcon>}
    </Subheader>
  )
}



export const SessionList = ({ controls, actions, changeRoute, sessions, users, activeSession, activeUser, facilities, roles }) => {
  const rolesList = [];
  roles.forEach((role) => {
    const roleId = role.id;
    const sessionsList = [];
    const expandedIndex = controls.expandedRolesSubheaders.indexOf(roleId);
    const newExpandedRolesSubheaders = Object.assign([], controls.expandedRolesSubheaders);
    if (expandedIndex >= 0) {
      newExpandedRolesSubheaders.splice(expandedIndex,1);
      const selectedSessions = sessions.filter((session) => session.roleId === roleId).sort();
      selectedSessions.forEach( (selectedSession) => {
        const selectedUser = users.find((user) => user.id === selectedSession.userId);
        if(selectedSession.roleId === roleId) {
          sessionsList.push(<SessionListItem
            key={selectedSession.id}
            session={selectedSession}
            user={selectedUser}
            actions={actions}
            initials={toInitials}
            forget={actions.forgetSession}
          />);
        }
      });
    } else {
      newExpandedRolesSubheaders.push(roleId);
    }
    const expandedRolesSubheaders = controls.expandedRolesSubHeaders
    if (sessionsList.length > 0) {
      rolesList.push(<div key={role.id}><ExpandibleSubheader text={role.name} expanded={expandedIndex >= 0} action={() => actions.controlsChanged({expandedRolesSubheaders: newExpandedRolesSubheaders})} /> {sessionsList}</div>);
    }
  });

  return (
    <List className="md-cell md-cell--4 md-cell--4-offset md-paper md-paper--1">
      <SessionLogo />
      <Subheader primaryText={<FormattedMessage {...messages.header} />} style={{ fontSize: '24px' }} />
      {rolesList}
      <Divider />
      {/* Filtrado de cuentas disponibles por tipo de funcionario no implementado. */}

      <ListItem
        primaryText={<FormattedMessage {...messages.changeAccount} />}
        leftAvatar={<Avatar>+</Avatar>}
        onClick={() => actions.signUp()}
      />
    </List>
  );
}

export default SessionList;
