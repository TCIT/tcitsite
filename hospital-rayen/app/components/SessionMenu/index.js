import React from 'react';

import Avatar from 'react-md/lib/Avatars';
import Button from 'react-md/lib/Buttons';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import Divider from 'react-md/lib/Dividers';
import ListItem from 'react-md/lib/Lists/ListItem';
import Menu from 'react-md/lib/Menus/Menu';
import MenuButton from 'react-md/lib/Menus';
import toInitials from 'utils/StringUtils/toInitials';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import AccessibleFakeButton from 'react-md/lib/Helpers/AccessibleFakeButton';


const getRoleName = (roles, roleId) => {
  const role = roles.find(role => role.id == roleId);
  return role ? role.name : null;
}

export const SessionMenu = ({ controls, actions, onClose, activeSession, sessions }) => {
  //if (session && session.facilitiesRol && session.facilityId && session.roleId) {
  //const { avatarUrl, healthCarePractitioner, facilitiesRol, facilityId, roleId } = session;
  const sessionsList = [];
  sessions.forEach((session) =>{
    if (session.token !== null && session.id !== activeSession.id) {
      const user = session.user();
      const role = session.role();
      sessionsList.push(<ListItem
        key={session.id}
        className="session-listitem"
        primaryText={`${user.firstGivenName} ${user.firstFamilyName}`}
        secondaryText={<div><div>{role.name}</div><div><FormattedMessage {...messages.changeAccount} /></div></div>}
        onClick={() => actions.resumeSession(session.id)}
        leftAvatar={
          <Avatar role="presentation">
            {toInitials(user.firstGivenName)}
          </Avatar>
        }
      />);
    }
  });
  const user = activeSession ? activeSession.user() : null;
  const activeRole = activeSession ? activeSession.role() : null;
  let avatarUrl, healthCarePractitioner, facilitiesRol;
  facilitiesRol = [];
  let roleId = activeSession ? activeSession.roleId : null;
  let facilityId = activeSession ? activeSession.facilityId : null;
  let roles = []
  let activeSessionComponent = '';
  const firstGivenName = user ? user.firstGivenName : ' ';
  const firstFamilyName = user ? user.firstFamilyName : ' ';
  if (activeSession) {
    JSON.parse(activeSession.userData).facilitiesRol.forEach((a) => roles = roles.concat(a.practitionerRoleList));
    activeSessionComponent = <ListItem
      key={activeSession ? activeSession.id : null}
      className="session-listitem"
      primaryText={`${firstGivenName} ${firstFamilyName}`}
      secondaryText={<div><div>{activeRole.name}</div><div><FormattedMessage {...messages.logout} /></div></div>}
      onClick={() => actions.logout()}
      leftAvatar={
        <Avatar role="presentation">
          {toInitials(firstGivenName)}
        </Avatar>
      }
    />;
  }
  return (
    <CardTitle
      style={{ float: 'left', marginTop: '-4px', background: 'transparent'}}
      avatar={
        <Avatar src={avatarUrl} role="presentation">
          {toInitials(firstGivenName)}
        </Avatar>
      }
      title={<span style={{color: 'white'}}>{`${firstGivenName} ${firstFamilyName}`}</span>}
      subtitle={<span style={{color: 'white'}}>{getRoleName(roles, roleId)}</span>}
      onClick={() => actions.controlsChanged({menuVisible: !controls.menuVisible})}
    >
      <Menu visible={controls.menuVisible} className="menu-example menu-example--static"
        id="static-1"
        onClose={() => actions.controlsChanged({menuVisible: false})}
        toggle={<AccessibleFakeButton></AccessibleFakeButton>}
      >
        {activeSessionComponent}
        {sessionsList}
        <ListItem key ={'SwitchAccount'} primaryText={<FormattedMessage {...messages.changeAccount} />} onClick={() => actions.switchAccount()} />
      </Menu>
    </CardTitle>
  );
}

export default SessionMenu;
