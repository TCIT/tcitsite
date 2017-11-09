import React from 'react';
import Card from 'react-md/lib/Cards/Card';
import {TextField, SelectField} from 'react-md/';
import Button from 'react-md/lib/Buttons';
import messages from './messages';
import CloseModal from 'components/CloseModal';
import CleanModal from 'components/CleanModal';

export default function RestAndDietForm ({selectorLabel, options, formatMessage, controls, actions, code}) {
  const selectedType = `${code}Id`;
  const payload = {};
  return (
    <div style={{width: '100%', padding: '0px 20px'}}>
      <div className='row' style={{marginTop: '40px'}}>
        <div className='col-md-12'>
          <SelectField 
            placeholder={selectorLabel}
            menuItems={options}
            itemLabel="name"
            fullWidth={true}
            position='below'
            itemValue="id"
            value={controls[selectedType]}
            onChange = {(value) => {
              payload[selectedType] = value;
              actions.controlsChanged(payload, code)
          }}
          />
        </div>
      </div>
      <div className='row' style={{marginTop: '20px'}}>
        <div className='col-md-12'>
          <TextField
            placeholder={formatMessage({...messages.notes})}
            style={{height: '100px', overflow:'scroll', width: 'auto'}}
            block={true}
            fullWidth={true}
            value={controls.observation}
            rows={5}
            onChange={(value) => actions.controlsChanged({observation: value}, code)}
          />
        </div>
      </div>
    </div>
  );
}
