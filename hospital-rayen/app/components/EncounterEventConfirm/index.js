import React from 'react';
import { Button, DialogContainer, List, ListItem } from 'react-md';
import messages from './messages';

export default function EncounterEventConfirm({ formatMessage, encounterEvent,practitionerId, actions}) {
  const now = new Date();
  const oldThings = [];
  const newThings = [];
  if (encounterEvent.observationEntry()) {
    newThings.push(<div>Evolución</div>);
  } else {
    oldThings.push(<div> Evolución</div>);
  }
  if (encounterEvent.restEntry() || encounterEvent.dietEntry() || 
    encounterEvent.procedureEntries().length > 0 || 
    encounterEvent.medicationRequestEntries().length > 0 ||
    encounterEvent.medicationDilutionEntries().length > 0 ||
    encounterEvent.medicationAlternativeEntries().length > 0) {
    newThings.push(<div> Indicaciones (Reposo, Régimen, Medicamento, Dilución)</div>);
  } else {
    oldThings.push(<div> Indicaciones (Reposo, Régimen, Medicamento, Dilución)</div>);
  }

  return (
    <DialogContainer
      visible={true}
      width='80%'
      id="simple-action-dialog"
    	actions={[
        <Button flat primary onClick={actions.cancelModal}>{formatMessage({...messages.cancel})}</Button>,
        <Button flat primary onClick={() => actions.confirmEncounterEvent(encounterEvent, practitionerId)}>{formatMessage({...messages.ok})}</Button>
    	]}
      title={formatMessage({...messages.title})}
    >
    <div className='row'>
      <div className='col-md-6'>{formatMessage({...messages.date})}: {now.toLocaleDateString()}</div>
      <div className='col-md-6'>{formatMessage({...messages.time})}: {now.toLocaleTimeString()}</div>
    </div>
    <div className='row'>
      <div className='col-md-4'>{formatMessage({...messages.newThings})}:</div>
      <div className='col-md-8'>{newThings}</div>
    </div>
    <div className='row'>
      <div className='col-md-4'>{formatMessage({...messages.oldThings})}:</div>
      <div className='col-md-8'>{oldThings}</div>
    </div>
    </DialogContainer>
  );
}

