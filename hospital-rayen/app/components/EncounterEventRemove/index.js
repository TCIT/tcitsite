import React from 'react';
import { Button, DialogContainer} from 'react-md';
import messages from './messages';

export default function EncounterEventRemove({ formatMessage, encounterEvent, practitionerId, actions}) {
  return (
    <DialogContainer
        visible={true}
        width='80%'
        id="simple-action-dialog"
      	actions={[
          <Button flat primary onClick={actions.cancelModal}>{formatMessage({...messages.cancel})}</Button>,
          <Button flat primary onClick={() => actions.removeEncounterEvent(encounterEvent, practitionerId)}>{formatMessage({...messages.ok})}</Button>
      	]}
        title={formatMessage({...messages.title})}
    >
    {formatMessage({...messages.body})}
    </DialogContainer>
  );
}

