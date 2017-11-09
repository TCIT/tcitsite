import React from 'react';
import {TextField, Checkbox, SelectField, CardText, CardActions, List,
  ListItem,
} from 'react-md/';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import messages from './messages';
import CacheSearch from '../CacheSearch';

export default function MediciationDilutionForm ({virtualMedicalProducts, formatMessage, controls, actions}) {
  const detailsList = [];
  controls.medicationDilutionRequestEntryDetail.forEach((detail, index) =>{
    const medicalProduct = virtualMedicalProducts.find((product) => product.id === detail.virtualMedicalProductId)
    detailsList.push(<ListItem
      primaryText={medicalProduct.name}
      secondaryText={detail.quantity}
      rightNodeStyle={{minWidth:'80px'}}
      rightIcon={<span>
        <Button onClick= {() => actions.controlsChanged(Object.assign(detail,{index}),'medicationDilution')} 
          iconEl={<i className="fa fa-pencil" aria-hidden="true"></i>} />
        <Button onClick= {() => {
          const medicationDilutionRequestEntryDetail = controls.medicationDilutionRequestEntryDetail;
          medicationDilutionRequestEntryDetail.splice(index,1);
          actions.controlsChanged({medicationDilutionRequestEntryDetail: medicationDilutionRequestEntryDetail},'medicationDilution')
        }} 
        iconEl={<i className="fa fa-trash" aria-hidden="true"></i>} /></span>}
    />);
  });
  console.log("CTR")
  console.log(controls.virtualMedicalProductSearch)
  return <CardText style={{width: '100%'}}>
    <div style={{padding:'0px 20px', height: '250px', overflowY: 'scroll'}}>
    	<CacheSearch
        label={`${formatMessage({...messages.medication})}*`}
        searchTextValue={controls.virtualMedicalProductSearch}
        primaryDescCode='descriptor'
        secondaryDescCode='name'
        onChangeSearch={(value) => actions.search({virtualMedicalProductSearch: value}, 'virtualMedicalProduct', 'medicationDilution', 'virtualMedicalProducts', 'name')}
        onSelect={(object) => actions.controlsChanged({virtualMedicalProduct: object, virtualMedicalProductSearch: object.name, virtualMedicalProducts: []}, 'medicationDilution')}
        resultObjects={controls.virtualMedicalProducts}
        selectedObject={controls.virtualMedicalProduct}
        searching={controls.searchingCache}
      />
      <TextField
        label={formatMessage({...messages.quantity})}
        type='number'
        fullWidth={true}
        value={controls.quantity}
        onChange = {(value) => actions.controlsChanged({quantity: value}, 'medicationDilution')}
      />
      <Button
        label={controls.index !== null ? formatMessage({...messages.edit}): formatMessage({...messages.add})}
        onClick={() => {
          const medicationDilutionRequestEntryDetail = controls.medicationDilutionRequestEntryDetail;
          if (controls.index !== null) {
            medicationDilutionRequestEntryDetail[controls.index] = {virtualMedicalProductId: controls.virtualMedicalProduct.id, quantity: controls.quantity};
          } else {
            medicationDilutionRequestEntryDetail.push({virtualMedicalProductId: controls.virtualMedicalProduct.id, quantity: controls.quantity});
          }
          actions.controlsChanged({medicationDilutionRequestEntryDetail: medicationDilutionRequestEntryDetail, quantity: '', virtualMedicalProductId: '', index: null}, 'medicationDilution')
        }}
      />
      <List>
        {detailsList}
      </List>
      <TextField
        label={formatMessage({...messages.posology})}
        fullWidth={true}
        value={controls.posology}
        onChange = {(value) => actions.controlsChanged({posology: value}, 'medicationDilution')}
      />
      <TextField
        label={formatMessage({...messages.indications})}
        fullWidth={true}
        value={controls.administrationNote}
        onChange = {(value) => actions.controlsChanged({administrationNote: value}, 'medicationDilution')}
      />


    </div>
  </CardText>;
}
