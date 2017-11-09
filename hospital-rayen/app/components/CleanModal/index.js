import React from 'react';
import { Button, DialogContainer, List, ListItem } from 'react-md';
import messages from './messages';

export default function CleanModal({ formatMessage, actions, formLabel, cleanForm}) {
  return (
    <DialogContainer
        visible={true}
        width='80%'
        style= {{position: 'absolute'}}
        dialogStyle= {{position: 'absolute'}}
        actions={[
          <Button flat primary onClick={actions.cancelModal}>{formatMessage({...messages.cancel})}</Button>,
          <Button flat primary onClick={cleanForm}>{formatMessage({...messages.ok})}</Button>
        ]}
        title={formatMessage({...messages.title}).replace('[FORM]', formLabel)}
    >
    {formatMessage({...messages.body}).replace('[FORM]', formLabel)}
    </DialogContainer>
  );
}

