import React from 'react';
import {TextField, Checkbox, SelectField, CardText, CardActions, FontIcon} from 'react-md/';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import messages from './messages';
import CacheSearch from '../CacheSearch';

export default function DiagnosisForm ({encounterEventId, encounterId, formatMessage, controls, actions, diagnosisStates, healthProblems, activeUserId}) {
  diagnosisStates = diagnosisStates.filter((diagnosisState) => diagnosisState.name !== 'Descartado');
  return (
    <div>
      <CardText>
        <div style={{padding:'0px 20px'}}>
          <TextField
            label={formatMessage({...messages.description})}
            fullWidth={true}
            value={controls.description}
            onChange = {(value) => actions.controlsChanged({description: value}, 'diagnosis')}
          />
        	<SelectField
            label={`${formatMessage({...messages.state})}*`}
        		menuItems={diagnosisStates}
        		itemLabel="name"
            fullWidth={true}
            position='below'
        		itemValue="id"
            value={controls.diagnosisEntryStateId}
            onChange = {(value) => actions.controlsChanged({diagnosisEntryStateId: value}, 'diagnosis')}
        	/>
           <div style={{width: '100%'}}>
            <div style={{width: '30%', float: 'left', marginRight: '10%'}}>
              <CacheSearch
                label={`${formatMessage({...messages.code})}`}
                searchTextValue={controls.searchCode}
                primaryDescCode='descriptor'
                secondaryDescCode='standarCode'
                onChangeSearch={(value) => actions.search({searchCode: value}, 'diagnosis', 'diagnosis', 'textDiagnoses', 'standarCode', 'diagnoses', 'textSearchingCache')}
                onSelect={(object) => actions.controlsChanged({diagnosis: object, searchText: object.name, searchCode: object.standarCode, textDiagnoses: []}, 'diagnosis')}
                resultObjects={controls.textDiagnoses}
                selectedObject={controls.diagnosis}
                searching={controls.textSearchingCache}
              />
            </div>
            <div style={{width: '50%', float: 'left', marginRight: '10%'}}>
              <CacheSearch
                label={`${formatMessage({...messages.search})}`}
                searchTextValue={controls.searchText}
                primaryDescCode='descriptor'
                secondaryDescCode='name'
                onChangeSearch={(value) => actions.search({searchText: value}, 'diagnosis', 'diagnosis', 'codeDiagnoses', 'name', 'diagnoses', 'codeSearchingCache')}
                onSelect={(object) => actions.controlsChanged({diagnosis: object, searchText: object.name, searchCode: object.standarCode, codeDiagnoses: []}, 'diagnosis')}
                resultObjects={controls.codeDiagnoses}
                selectedObject={controls.diagnosis}
                searching={controls.codeSearchingCache}
              />
            </div>
          </div>
          <div className='row'>
            <div style={{width: '80px', float: 'left'}}><Checkbox label="GES" checked={controls.isGes} onClick = {() => actions.controlsChanged({isGes: !controls.isGes}, 'diagnosis')}/></div>
            <div style={{paddingTop: '10px', float: 'left'}}><FontIcon>print</FontIcon></div>
          </div>
          <div className='row'>
            <div style={{width: '80px', float: 'left'}}><Checkbox label="ENO" checked={controls.isMorbidity} onClick = {() => actions.controlsChanged({isMorbidity: !controls.isMorbidity}, 'diagnosis')}/></div>
            <div style={{paddingTop: '10px', float: 'left'}}><FontIcon>print</FontIcon></div>
          </div>
          <SelectField
            label={`${formatMessage({...messages.healthProblem})}*`}
            menuItems={healthProblems}
            itemLabel="description"
            fullWidth={true}
            position='below'
            itemValue="id"
            value={controls.healthProblemId}
            onChange = {(value) => actions.controlsChanged({healthProblemId: value}, 'diagnosis')}
          />
        </div>
      </CardText>
    </div>
  );
}
