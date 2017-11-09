import React from 'react';
import {TextField, Checkbox, SelectField, CardText, CardActions} from 'react-md/';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import messages from './messages';

export default function MediciationRequestForm ({routeAdministrations,formatMessage, controls, actions}) {
  return <CardText style={{width: '100%'}}>
    <div style={{padding:'0px 20px', overflowY: 'scroll', height: '250px'}}>
    	<TextField
        label={`${formatMessage({...messages.product})}*`}
    		fullWidth={true}
        value={controls.product}
        onChange = {(value) => actions.controlsChanged({product: value}, 'medicationAlternative')}
    	/>
      <SelectField
        label={`${formatMessage({...messages.routeAdministration})}`}
        menuItems={routeAdministrations}
        itemLabel="name"
        fullWidth={true}
        position='below'
        itemValue="id"
        value={controls.routeAdministrationId}
        onChange = {(value) => actions.controlsChanged({routeAdministrationId: value}, 'medicationAlternative')}
      />
      <div className='row'>
        <TextField
          className='col-md-2'
          style={{width: '20%'}}
          label={formatMessage({...messages.dosis})}
          type='number'
          min={1}
          value={controls.dose}
          onChange = {(value) => actions.controlsChanged({dose: value}, 'medicationAlternative')}
        />
        <TextField
          label={formatMessage({...messages.each})}
          type='number'
          min={1}
          style={{width: '20%', float: 'left'}}
          value={controls.doseFrecuency}
          onChange = {(value) => actions.controlsChanged({doseFrecuency: value}, 'medicationAlternative')}
        />
        <span style={{width: '20%', float: 'left', lineHeight: '70px'}}>{formatMessage({...messages.hours})}</span>
        <TextField
          label={formatMessage({...messages.per})}
          type='number'
          min={1}
          style={{width: '20%', float: 'left'}}
          value={controls.doseDuration}
          onChange = {(value) => actions.controlsChanged({doseDuration: value}, 'medicationAlternative')}
        />
        <span style={{width: '20%', float: 'left', lineHeight: '70px'}}>{formatMessage({...messages.days})}</span>
      </div>
      <TextField
        label={formatMessage({...messages.indications})}
        fullWidth={true}
        value={controls.doseInstructions}
        onChange = {(value) => actions.controlsChanged({doseInstructions: value}, 'medicationAlternative')}
      />
    </div>
  </CardText>;
}
