import React from 'react';
import {TextField, Checkbox, SelectField, CardText, CardActions, FontIcon, SelectionControlGroup} from 'react-md/';

import Toolbar from 'react-md/lib/Toolbars';
import Button from 'react-md/lib/Buttons';
import messages from './messages';
import CacheSearch from '../CacheSearch';

export default function ReferralForm ({encounterEventId, encounterId, formatMessage, controls, actions, roles, referralReasons, referralPriorities, diagnosisEntries, activeUserId}) {
  return (
    <div>
      <CardText>
        <div style={{padding:'0px 20px', height: '250px', overflowY: 'scroll'}}>
          <SelectionControlGroup
            id='referralType'
            type="radio"
            label={formatMessage({...messages.type})}
            inline={true}
            value={controls.referralType}
            onChange = {(value) =>actions.controlsChanged({referralType: value}, 'referral')}
            controls={[{
              label: formatMessage({...messages.type1}),
              value: '1',
            }, {
              label: formatMessage({...messages.type2}),
              value: '2',
            }]}
          />
          <SelectField
            label={`${formatMessage({...messages.role})}*`}
            menuItems={roles}
            itemLabel="name"
            fullWidth={true}
            position='below'
            itemValue="id"
            value={controls.healthCarePractitionerMedicalSpecialtyId}
            onChange = {(value) => actions.controlsChanged({healthCarePractitionerMedicalSpecialtyId: value}, 'referral')}
          />
          <SelectField
            label={`${formatMessage({...messages.reason})}*`}
            menuItems={referralReasons}
            itemLabel="name"
            fullWidth={true}
            position='below'
            itemValue="id"
            value={controls.referralRequestReasonId}
            onChange = {(value) => actions.controlsChanged({referralRequestReasonId: value}, 'referral')}
          />
          <SelectionControlGroup
            id='referralRequestPriorityId'
            type="radio"
            label={formatMessage({...messages.priority})}
            inline={true}
            value={controls.referralRequestPriorityId}
            onChange = {(value) =>actions.controlsChanged({referralRequestPriorityId: value}, 'referral')}
            controls={referralPriorities.map((priority) => {return {label: priority.name, value: priority.id.toString()};})}
          />
          {diagnosisEntries.map((diagnosisEntry) => {
            const selectedDiagnosisEntries = controls.referralRequestDiagnosis;
            const index = selectedDiagnosisEntries.findIndex((object) => object.diagnosisEntryId === diagnosisEntry.id);
            const isChecked = index >= 0;
            return <Checkbox
              label={diagnosisEntry.name()}
              checked={isChecked}
              value={diagnosisEntry.id}
              onClick={() => {
                if(isChecked){
                  selectedDiagnosisEntries.splice(index, 1);
                } else {
                  selectedDiagnosisEntries.push({diagnosisEntryId: diagnosisEntry.id});
                }
                actions.controlsChanged({referralRequestDiagnosis: selectedDiagnosisEntries}, 'referral');
              }}
            />;
          })}
          <TextField
            label={formatMessage({...messages.fundaments})}
            fullWidth={true}
            value={controls.clinicalFundament}
            onChange = {(value) => actions.controlsChanged({clinicalFundament: value}, 'referral')}
          />
          <TextField
            label={formatMessage({...messages.observations})}
            fullWidth={true}
            value={controls.observations}
            onChange = {(value) => actions.controlsChanged({observations: value}, 'referral')}
          />
        </div>
      </CardText>
    </div>
  );
}
