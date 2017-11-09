import React from 'react';
import Button from 'react-md/lib/Buttons';
import Card from 'react-md/lib/Cards/Card';
import CardActions from 'react-md/lib/Cards/CardActions';
import CardText from 'react-md/lib/Cards/CardText';
import CardTitle from 'react-md/lib/Cards/CardTitle';
import SelectField from 'react-md/lib/SelectFields';
import SessionLogo from 'components/SessionLogo';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const SessionRole = ({activeSessionData, actions, controls, logingSession, error}) => {
  const facilities = activeSessionData.facilitiesRol.map(facilityRole => facilityRole.facility);
  let roles = [];
  let selectedFacilityId, selectedRoleId;
  if (logingSession) {
    selectedFacilityId = logingSession.facilityId;
    selectedRoleId = logingSession.roleId;
  } else {
    selectedFacilityId = facilities.length === 1 ? facilities[0].id : controls.facilityId;
    const selectedFacility = activeSessionData.facilitiesRol.find((facilityRole) => facilityRole.facility.id === selectedFacilityId);
    roles = selectedFacility ? selectedFacility.practitionerRoleList : [];
    selectedRoleId = roles.length === 1 ? roles[0].id : controls.roleId;
  }
  const payload = {
    facilityId: selectedFacilityId, 
    roleId: selectedRoleId, 
    activeSession: activeSessionData
  };
  let content = <div></div>;
  const autoRedirect = logingSession || (facilities.length === 1 && roles.length === 1)
  if (autoRedirect) {
    if (error === null || error === '') {
      actions.confirmRole(payload);
    } else {
      content = <div className="md-grid">
        <Card className="md-cell md-cell--4 md-cell--4-offset">
          <SessionLogo />
          <p style={{color: 'red'}}> {error}</p>
        </Card>
      </div>;
    }
  } else {
    let facilitySelector = <SelectField
      id="facilities"
      label={<FormattedMessage {...messages.facility} />}
      placeholder={<FormattedMessage {...messages.facilityLabel} />}
      menuItems={facilities}
      itemLabel="name"
      itemValue="id"
      value={selectedFacilityId}
      disabled={facilities.length === 1}
      helpOnFocus={false}
      helpText={<FormattedMessage {...messages.facilityHelper} />}
      onChange={(value) => actions.controlsChanged({facilityId: value})}
    />;
    if (facilities.length === 1) {
      facilitySelector = <div className="md-select-field__toggle">
        <label className="md-floating-label md-floating-label--floating md-text--secondary">{<FormattedMessage {...messages.facility} />}</label>
        <div className="md-select-field">
          <div className="md-icon-separator md-text-field md-text-field--floating-margin">
            <span className="md-icon-text">{facilities[0].name}</span>
          </div>
          <hr className="md-divider md-divider--text-field"/> 
        </div>
      </div>;
    }
    let roleSelector = '';
    if (selectedFacilityId) {
      roleSelector = <SelectField
        id="roles"
        label={<FormattedMessage {...messages.role} />}
        placeholder={<FormattedMessage {...messages.roleLabel} />}
        menuItems={roles}
        itemLabel="name"
        itemValue="id"
        value={selectedRoleId}
        helpOnFocus={false}
        helpText={<FormattedMessage {...messages.roleHelper} />}
        onChange={(value) => actions.controlsChanged({roleId: value})}
      />;
      if (roles.length === 1) {
        roleSelector = <div className="md-select-field__toggle">
          <label className="md-floating-label md-floating-label--floating md-text--secondary">{<FormattedMessage {...messages.role} />}</label>
          <div className="md-select-field">
            <div className="md-icon-separator md-text-field md-text-field--floating-margin">
              <span className="md-icon-text">{roles[0].name}</span>
            </div>
            <hr className="md-divider md-divider--text-field"/> 
          </div>
        </div>;
      }
    }
    content = <div className="md-grid">
      <Card className="md-cell md-cell--4 md-cell--4-offset">
        <SessionLogo />
        <CardText>
          <CardTitle title={<FormattedMessage {...messages.header} />} />
          {facilitySelector}
          {roleSelector}
        </CardText>
        <p style={{color: 'red'}}> {error}</p>
        <CardActions style={{justifyContent: 'flex-end'}}>
          <Button flat onClick={() => 0}>
            Cancelar
          </Button>
          <Button raised primary disabled={!selectedRoleId} onClick={() => actions.confirmRole(payload)}>
            Ingresar
          </Button>
        </CardActions>
      </Card>
    </div>;
  }
  return content;
}

export default SessionRole;
