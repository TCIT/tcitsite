import React from 'react';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import DataTable from 'react-md/lib/DataTables/DataTable';
import { ExpansionList, ExpansionPanel } from 'react-md';
import TableBody from 'react-md/lib/DataTables/TableBody';
import SelectField from 'react-md/lib/SelectFields';
import Button from 'react-md/lib/Buttons/Button';
import messages from './messages';
import { calculateInterval, calculateStay } from '../../filters/filters.js'

export default function EncountersTable({ formatMessage, context, actions, claims, encounters, selectedPractitionerId, title, practitioners }) {
  const encountersDisplay = [];
  const practitionersOptions = practitioners.map((practitioner)=> {return {
    value: practitioner.id, 
    label: <div style={{fontSize: '13px'}}>{`${practitioner.firstGivenName} ${practitioner.firstFamilyName}`}</div>
  }});
  encounters.forEach( (encounter)=> {
    const patient = encounter.patient();
    const taxNumber = patient.identifier;
    const numeral = taxNumber.substr(0,taxNumber.length - 1);
    const checker = taxNumber[taxNumber.length - 1];
    const strTaxNumber = `${numeral.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${checker}`;
    const age = calculateInterval(patient.birthDate, formatMessage);
    const startEncounter = new Date(encounter.startDatetime);
    const stay = calculateStay(startEncounter, formatMessage);
    let sex = '';
    switch (patient.administrativeSexId) {
      case 2: sex = <i className="fa fa-venus" aria-hidden="true"></i>; break;
      case 3: sex = <i className="fa fa-mars" aria-hidden="true"></i>; break;
    }
    let assignedPractitioner = encounter.practitioner();
    let assignPractitioner = assignedPractitioner ? `${assignedPractitioner.firstGivenName} ${assignedPractitioner.firstFamilyName}` : 'Sin asignar';
    if (true || claims.indexOf('Asignacion_medico') >= 0){
      assignPractitioner = <SelectField
        inputStyle={{fontSize:'13px'}}
        position={SelectField.Positions.BELOW}
        id={`selector-${encounter.id}`}
        placeholder={formatMessage({...messages.selectPlaceholder})}
        menuItems={practitionersOptions}
        value={encounter.assignedHealthCarePractitionerId}
        onChange={(value) => actions.assignPractitioner(encounter, practitioners.find((practitioner)=> practitioner.id === value))}
      />
    }
    let accessMedicalRecord = null;
    if (true || claims.indexOf('Acceso_ficha_clinica') >= 0){
      accessMedicalRecord = () => actions.accessMedicalRecord(encounter.id);
    }
    encountersDisplay.push(<TableRow key={encounter.id}>
      <TableColumn adjusted={false} onClick={accessMedicalRecord} style={{fontWeight: 'bold', fontFamily: 'roboto', padding: '5px 0px'}}>
        {encounter.hospitalDepartmentShortName}<br/>{encounter.roomShortName}<br/>{encounter.bedShortName}
      </TableColumn>
      <TableColumn adjusted={false} onClick={accessMedicalRecord}>
        <div style={{float: 'center'}}>
          {sex} &nbsp;
          {patient.patientName} &nbsp;
          <span style={{background: '#FD5835', borderRadius: '2px', color: 'white', padding:'2px 4px', fontSize: '9px'}}>
            {encounter.status ? formatMessage({...messages[encounter.status.toLowerCase()]}) : ''}
          </span><br/>
          <span style={{color: 'grey'}}>
            {formatMessage({...messages.socialName})}: {patient.patientNickname}<br/>
            {taxNumber ? `RUN: ${strTaxNumber} `:' '}
          </span>
          
        </div>
      </TableColumn>
      <TableColumn adjusted={false} onClick={accessMedicalRecord}>{age}</TableColumn>
      <TableColumn adjusted={false} onClick={accessMedicalRecord}>{encounter.hospitalDepartmentShortName}</TableColumn>
      <TableColumn adjusted={false} onClick={accessMedicalRecord} style={{textAlign: 'center'}}>{stay}<br/><span style={{color:'grey'}}>({startEncounter.toLocaleDateString()})</span></TableColumn>
      <TableColumn adjusted={false} onClick={accessMedicalRecord}>{encounter.diagnosisName}</TableColumn>
      <TableColumn adjusted={false}>{assignPractitioner}</TableColumn>
    </TableRow>)
  });
  
  return (
    <ExpansionPanel label={<h3 style={{color: '#159588'}}>{title}</h3>} footer={null} defaultExpanded className="md-block-centered">
      <DataTable plain className="contact-table" style={{webkitFontSmoothing: 'antialiased', overflow:'visible'}}>
        <TableHeader>
            <TableRow>
              <TableColumn header={true} adjusted={false}>{formatMessage({...messages.location})}</TableColumn>
              <TableColumn header={true} adjusted={false}>{formatMessage({...messages.patient})}</TableColumn>
              <TableColumn header={true} adjusted={false}>{formatMessage({...messages.age})}</TableColumn>
              <TableColumn header={true} adjusted={false}>{formatMessage({...messages.origin})}</TableColumn>
              <TableColumn style={{textAlign: 'center'}} header={true} adjusted={false}>{formatMessage({...messages.stay})}</TableColumn>
              <TableColumn header={true} adjusted={false}>{formatMessage({...messages.diagnosis})}</TableColumn>
              <TableColumn style={{textAlign: 'center'}} header={true} adjusted={false}>{formatMessage({...messages.assignment})}</TableColumn>
            </TableRow>
          </TableHeader>
        <TableBody style={{fontSize:'13px'}}>{encountersDisplay}</TableBody>
      </DataTable>
    </ExpansionPanel>
  );
}

