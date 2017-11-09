import React from 'react';
import { CardTitle } from 'react-md';
import messages from './messages';
import { hsla } from '../../filters/filters.js'

export default function EncounterEventsSectionTitle({ formatMessage, title, encounterEvent}) {
  let lastUpdateSection = '';
  if (encounterEvent) {
  	const practitioner = encounterEvent.practitioner();
  	lastUpdateSection = <div style={{color: 'gray', fontSize: '12px', color: hsla(0, 0, 0, 0.54)}}>{formatMessage({...messages.lastUpdate})}: {new Date(encounterEvent.recordDateTime).toLocaleString()} Dr. {practitioner.firstGivenName} {practitioner.firstFamilyName}</div>;
  }
  return (
    <CardTitle title={<div><div style={{fontSize: '24px'}} className='primary-text'>{title}</div>{lastUpdateSection}</div>}/> 
  );
}

