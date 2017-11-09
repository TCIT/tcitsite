import React from 'react';
import {TextField, Checkbox, SelectField, CardText, CardActions} from 'react-md/';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import messages from './messages';

export default function ProcedureForm ({encounterEventId, encounterId, formatMessage, controls, actions, procedures, roles, activeUserId}) {
  roles = roles.filter((role) => role.name !== 'Médico');
  return (
    <div>
      <CardText>
        <div style={{padding:'0px 20px'}}>
        	<SelectField
            label={`${formatMessage({...messages.to})}*`}
        		menuItems={roles}
        		itemLabel="name"
            fullWidth={true}
            position='below'
        		itemValue="id"
            value={controls.healthCarePractitionerRoleId}
            onChange = {(value) => actions.controlsChanged({healthCarePractitionerRoleId: value}, 'procedure')}
        	/>
          <SelectField
            inputStyle={{overflowX: 'hidden'}}
            label={`${formatMessage({...messages.procedure})}*`}
            menuItems={procedures}
            itemLabel="name"
            fullWidth={true}
            position='below'
            itemValue="id"
            value={controls.procedureId}
            onChange = {(value) => actions.controlsChanged({procedureId: value}, 'procedure')}
          />
          <TextField
            label={formatMessage({...messages.sessions})}
            type='number'
            min={0}
            max={99}
            fullWidth={true}
            value={controls.sessionsQuantity}
            onChange = {(value) => {
              if (value.length<3) {
                actions.controlsChanged({sessionsQuantity: value}, 'procedure');
              }
            }}
          />
          <TextField
            label={formatMessage({...messages.fundaments})}
            fullWidth={true}
            value={controls.fundaments}
            onChange = {(value) => actions.controlsChanged({fundaments: value}, 'procedure')}
          />
        </div>
      </CardText>
    </div>
  );
}
