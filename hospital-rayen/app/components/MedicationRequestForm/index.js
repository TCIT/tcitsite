import React from 'react';
import { CardText, CardActions, Checkbox, SelectField, TextField } from 'react-md/';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import messages from './messages';
import CacheSearch from '../CacheSearch';

export default function MedicationRequestForm ({routeAdministrations, virtualMedicalProducts, formatMessage, controls, actions}) {
  return <CardText style={{width: '100%'}}>
    <div style={{padding:'0px 20px', height: '250px', overflowY: 'scroll'}}>
      <CacheSearch
        label={`${formatMessage({...messages.medication})}*`}
        searchTextValue={controls.virtualMedicalProductSearch}
        primaryDescCode='descriptor'
        secondaryDescCode='name'
        onChangeSearch={(value) => actions.search({virtualMedicalProductSearch: value}, 'virtualMedicalProduct', 'medicationRequest', 'virtualMedicalProducts', 'name')}
        onSelect={(object) => actions.controlsChanged({virtualMedicalProduct: object, virtualMedicalProductSearch: object.name, virtualMedicalProducts: []}, 'medicationRequest')}
        resultObjects={controls.virtualMedicalProducts}
        selectedObject={controls.virtualMedicalProduct}
        searching={controls.searchingCache}
      />
      <SelectField
        label={`${formatMessage({...messages.routeAdministration})}*`}
        menuItems={routeAdministrations}
        itemLabel="name"
        fullWidth={true}
        position='below'
        itemValue="id"
        value={controls.routeAdministrationId}
        onChange = {(value) => actions.controlsChanged({routeAdministrationId: value}, 'medicationRequest')}
      />
      <TextField
        label={formatMessage({...messages.posology})}
        fullWidth={true}
        value={controls.posology}
        onChange = {(value) => actions.controlsChanged({posology: value}, 'medicationRequest')}
      />
      <TextField
        label={formatMessage({...messages.indications})}
        fullWidth={true}
        value={controls.administrationNote}
        onChange = {(value) => actions.controlsChanged({administrationNote: value}, 'medicationRequest')}
      />
    </div>
  </CardText>
}
