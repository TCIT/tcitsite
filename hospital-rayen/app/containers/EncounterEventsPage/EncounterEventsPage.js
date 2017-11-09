import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import Button from 'react-md/lib/Buttons';
import { Card, CardTitle, CardText, TabsContainer, Tabs, Tab, DataTable,TableHeader,
  TableBody,TableRow, TableColumn, Switch, CardActions, FontIcon} from 'react-md';
import Dialog from 'react-md/lib/Dialogs';

import randomInt from 'utils/RandomUtils/randomInt';
import TableActions from 'components/TableActions';
import Header from 'components/Header';
import ActionModal from 'components/ActionModal';

import { defaultAction, selectContact, removeContact } from './actions';
import { showMessage } from 'containers/NotificationCenter/actions';
import messages from './messages';
import { reselectObjects } from '../App/selectors';
import EncountersTable from '../../components/EncountersTable';
import * as encounterEventsActions from './actions';
import { FormattedMessage } from 'react-intl';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import EncounterEventsSectionTitle from 'components/EncounterEventsSectionTitle';
import ObservationForm from 'components/ObservationForm';
import ProcedureForm from 'components/ProcedureForm';
import MedicationRequestForm from 'components/MedicationRequestForm';
import MedicationDilutionForm from 'components/MedicationDilutionForm';
import MedicationAlternativeForm from 'components/MedicationAlternativeForm';
import RestAndDietForm from 'components/RestAndDietForm';
import DiagnosisForm from 'components/DiagnosisForm';
import ReferralForm from 'components/ReferralForm';
import EncounterEventConfirm from 'components/EncounterEventConfirm';
import EncounterEventRemove from 'components/EncounterEventRemove';
import Form from 'components/Form';
import Avatar from 'react-md/lib/Avatars';
import List from 'react-md/lib/Lists/List';
import ListItem from 'react-md/lib/Lists/ListItem';
import { calculateInterval, calculateStay } from '../../filters/filters.js'
import CloseModal from 'components/CloseModal';
import CleanModal from 'components/CleanModal';

export class EncounterEventsPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const encounterId = this.props.routeParams.encounterId;
    this.props.actions.getEncounterEvents(encounterId);
  }

  render() {
    let content = <div></div>;
    const encounterId = parseInt(this.props.routeParams.encounterId);
    let blankview = <div></div>;
    const formatMessage = this.context.intl.formatMessage;
    const { actions, changeRoute, objects } = this.props;
    const roles = Object.values(objects.roles);
    const activeSessionId = this.props.app.activeSessionId;
    const currentEncounter = objects.encounters[encounterId];
    if (activeSessionId && currentEncounter && currentEncounter.bed) {
      let editingEncounterEventId = null;
      const currentPatient = currentEncounter.patient();
      const encounterEvents = currentEncounter.encounterEvents().filter((encounterEvent) => !encounterEvent.deleted).sort((a,b) => new Date(b.recordDateTime) - new Date(a.recordDateTime));
      const age = calculateInterval(currentPatient.birthdate, formatMessage);
      const startEncounter = new Date(currentEncounter.startPeriod);
      let [stay, timeUnit] = calculateStay(startEncounter, formatMessage).split(' ');
      timeUnit = `${timeUnit[0].toUpperCase()}${timeUnit.substr(1,timeUnit.length)}`;
      let sexSymbol = '';
      switch (currentPatient.administrativeSexId) {
        case 2: sexSymbol = <i className="fa fa-venus" aria-hidden="true"></i>; break;
        case 3: sexSymbol = <i className="fa fa-mars" aria-hidden="true"></i>; break;
      }
      const procedures = Object.values(objects.procedures).slice(1,10);
      const rests = Object.values(objects.rests);
      const diets = Object.values(objects.diets);
      const routeAdministrations = Object.values(objects.routeAdministrations);
      const diagnosisStates = Object.values(objects.diagnosisStates);
      const referralReasons = Object.values(objects.referralReasons);
      const referralPriorities = Object.values(objects.referralPriorities);
      const healthProblems = Object.values(objects.healthProblems);
      const procedureEntries = Object.values(objects.procedureEntries);
      const medicationRequestEntries = Object.values(objects.medicationRequestEntries);
      const medicationDilutionEntries = Object.values(objects.medicationDilutionEntries);
      const medicationAlternativeEntries = Object.values(objects.medicationAlternativeEntries);
      const alertEntries = Object.values(objects.alertEntries);
      const shiftChangeEntries = Object.values(objects.shiftChangeEntries);
      const diagnosisEntries = Object.values(objects.diagnosisEntries).filter((value, index, self) => { 
        const encounterEvent = value.encounterEvent();
        return self.findIndex((diagnosisEntry) => diagnosisEntry.guid === value.guid) === index 
          && encounterEvent && !encounterEvent.deleted && encounterEvent.encounterId === encounterId 
          && (!value.archived || !encounterEvent.publishDateTime);
      });
      const referralEntries = Object.values(objects.referralEntries);
      const activeSession = objects.sessions[activeSessionId];
      const activeUserId = activeSession.userId;
      const activeFacilityId = activeSession.facilityId;
      const templates = Object.values(objects.templates).sort((a,b) => a.name > b.name);
      const claims = activeSession.claims;
      const { listForms, selectedForm, controls, heights, editingObject, encounterEventId, modals, selectedTab} = this.props.encounterEvents;
      let physicalSection = formatMessage({...messages.defaultPhysical});
      let signSection = formatMessage({...messages.defaultSigns});
      let orderSection = formatMessage({...messages.defaultOrders});
      let testSection = formatMessage({...messages.defaultTests});
      let pavillionSection = formatMessage({...messages.defaultPavillions});
      const activeEncounterEventId = encounterEvents[0] && !encounterEvents[0].publishDateTime ? encounterEvents[0].id : null;
      const lastEncounterEvent = encounterEvents[0] ? encounterEvents[0].publishDateTime ? encounterEvents[0] : encounterEvents[1] : null;
      const heightObservation = Math.max(heights.observation, heights.shiftChange);
      //OBSERVATION SECTION
      const observationEntryContainer = encounterEvents.find((encounterEvent) => { const entry = encounterEvent.observationEntry(); return entry && entry.deletedDateTime=== null;});
      const activeObservationEntry = observationEntryContainer ?  observationEntryContainer.observationEntry() : null;  
      let observationContent = <div>{formatMessage({...messages.dontSee})}</div>;
      let observationBackgroundColor = 'white';
      let observationOpacity = 1;
      if (claims.indexOf('Ver_Evolucion') >= 0) {
        observationContent = formatMessage({...messages.defaultObservation});
        if (activeObservationEntry) {
          let editButton = '';
          let removeButton = '';
          if (!observationEntryContainer.publishDateTime) {
            observationBackgroundColor = '#FFFFC0';
            observationOpacity = 0.85;
            if (claims.indexOf('Editar_Evolucion') >= 0) {
              editButton = <Button style={{color: 'darkOrange'}} label={formatMessage({...messages.edit})} onClick={() => actions.prepare('EV', null, 'form', 'observation',activeObservationEntry)}/>;
            }
            if (claims.indexOf('Cancelar_Evolucion') >= 0) {
              removeButton = <Button style={{color: 'darkOrange'}} label={formatMessage({...messages.cancel})} onClick={() => actions.removeObservation(observationEntryContainer.encounterId, observationEntryContainer.id, activeObservationEntry.id, activeObservationEntry.timestamp)}/>;
            }
          }
          observationContent = <div>
            {editButton}{removeButton}      
            <div>
              {activeObservationEntry.notes}
            </div>
            {activeObservationEntry.hasReseachProtocol ? <div><i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
              {formatMessage({...messages.researchProtocol})}
              <div>{activeObservationEntry.protocolNotes}</div>
            </div> : ''}
          </div>;
        }
      }
      const observationSection = <div 
        ref={(node) => node && heights.observation !== node.offsetHeight ? actions.changeHeight('observation', node.offsetHeight) : null} 
        className='col-md-6' 
        style = {{background: observationBackgroundColor, opacity: observationOpacity, minHeight: heightObservation, borderRight: 'solid lightGray 1px'}}
      >
        <EncounterEventsSectionTitle formatMessage={formatMessage} title={formatMessage({...messages.observation})} encounterEvent={observationEntryContainer}/> 
        {observationContent}
      </div>;
      // REST SECTION
      const restEntryContainer = encounterEvents.find((encounterEvent) => { const entry = encounterEvent.restEntry(); return entry && entry.deletedDateTime=== null;});
      const activeRestEntry = restEntryContainer ?  restEntryContainer.restEntry() : null;  
      let restContent = <div>{formatMessage({...messages.dontSee})}</div>;
      let restBackgroundColor = 'rgba(21, 149, 136, 0.15)';
      if (true || claims.indexOf('Ver_Reposo') >= 0) { 
        restContent = formatMessage({...messages.defaultRest});
        if (activeRestEntry) {
          let editButton = '';
          let removeButton = '';
          if (!restEntryContainer.publishDateTime) {
            restBackgroundColor = '#FFFFC0';
            if (true || claims.indexOf('editar_evolucion') >= 0) {
              editButton = <Button style={{color: 'darkOrange'}} label={formatMessage({...messages.edit})} onClick={() => actions.prepare('RR', 0, 'form', 'rest',activeRestEntry)}/>;
            }
            if (true || claims.indexOf('cancelar_evolucion') >= 0) {
              removeButton = <Button style={{color: 'darkOrange'}} label={formatMessage({...messages.cancel})} onClick={() => actions.removeRest(restEntryContainer.encounterId, restEntryContainer.id, activeRestEntry.id, activeRestEntry.timestamp)}/>;
            }
          }
          restContent = <div className='row'>
            <div className='col-xs-8'>
              <div style={{background: restBackgroundColor, borderRadius: '16px', width: 'fit-content', padding: '3px 12px'}}>{activeRestEntry.rest().name}</div>
              <div>{activeRestEntry.observation}</div>
            </div>
            <div className='col-xs-4'>
              {editButton}{removeButton}
            </div>
          </div>;
        }
      }
      const restSection =<div className='row' style={{padding: '5px 0px'}}>
        <div className='col-xs-2'><b>{formatMessage({...messages.rest})}:</b></div>
        <div className='col-xs-10'>{restContent}</div>
      </div>;
      // DIET SECTION
      const dietEntryContainer = encounterEvents.find((encounterEvent) => { const entry = encounterEvent.dietEntry(); return entry && entry.deletedDateTime=== null;});
      const activeDietEntry = dietEntryContainer ?  dietEntryContainer.dietEntry() : null;  
      let dietContent = <div>{formatMessage({...messages.dontSee})}</div>;
      let dietBackgroundColor = 'rgba(21, 149, 136, 0.15)';
      if (claims.indexOf('Ver_Regimen') >= 0) { 
        dietContent = formatMessage({...messages.defaultDiet});
        if (activeDietEntry) {
          let editButton = '';
          let removeButton = '';
          if (!dietEntryContainer.publishDateTime) {
            dietBackgroundColor = '#FFFFC0';
            if (claims.indexOf('Editar_Regimen') >= 0) {
              editButton = <Button style={{color: 'darkOrange'}} label={formatMessage({...messages.edit})} onClick={() => actions.prepare('RR', 1, 'form', 'diet',activeDietEntry)}/>;
            }
            if (claims.indexOf('Cancelar_Regimen') >= 0) {
              removeButton = <Button style={{color: 'darkOrange'}} label={formatMessage({...messages.cancel})} onClick={() => actions.removeDiet(dietEntryContainer.encounterId, dietEntryContainer.id, activeDietEntry.id, activeDietEntry.timestamp)}/>;
            }
          }
          dietContent = <div className='row'  style={{padding: '5px 0px'}}>
            <div className='col-xs-8'>
              <div style={{background: dietBackgroundColor, borderRadius: '16px', width: 'fit-content', padding: '3px 12px'}}>{activeDietEntry.diet().name}</div>
              <div>{activeDietEntry.observation}</div>
            </div>
            <div className='col-xs-4'>
              {editButton}{removeButton}
            </div>
          </div>;
        }
      }
      const dietSection =<div className='row'>
        <div className='col-xs-2'><b>{formatMessage({...messages.diet})}:</b></div>
        <div className='col-xs-10'>{dietContent}</div>
      </div>;
      // MEDICINE SECTION
      const medicationsList = [];
      const productsList = [];
      // REQUEST
      medicationRequestEntries.filter((value, index, self) => 
        self.findIndex((medicationEntry) => medicationEntry.guid === value.guid) === index).forEach((firstMedicationEntry) => {
        const firstEncounterEvent = firstMedicationEntry.encounterEvent();
        const medicationEntry = medicationRequestEntries.slice(0).reverse().find((thisMedicationEntry) => thisMedicationEntry.guid === firstMedicationEntry.guid);
        const encounterEvent = medicationEntry.encounterEvent();
        let show = true;
        if (encounterEvent && !encounterEvent.deleted &&encounterEvent.encounterId === encounterId) {
          const state = medicationEntry.suspended;
          let submitFunction = () => actions.suspendMedicationRequest(medicationEntry, activeEncounterEventId, activeUserId);
          if (state) {
            if ((new Date() - new Date(medicationEntry.startDateTime))/1000/3600 >=12) {
              show = false;
            }
            submitFunction = () => actions.unsuspendMedicationRequest(medicationEntry, activeEncounterEventId, activeUserId);
          }
          
          let actionsComponent = <TableColumn></TableColumn>;
          if (medicationEntry.encounterEventId === activeEncounterEventId && medicationEntry.id === firstMedicationEntry.id) {
            let editButton = '';
            let removeButton = '';
            if (claims.indexOf('Editar_Medicamento') >= 0) {
              editButton = <Button
                onClick={() => actions.prepare('IF', 0, 'form', 'medicationRequest', medicationEntry)}
                style={{}}
                label={<FontIcon>edit</FontIcon>}
              />;
            }
            if (claims.indexOf('Eliminar_Medicamento') >= 0) {
              removeButton = <Button
                onClick={() => actions.removeMedicationRequest(medicationEntry)}
                style={{}}
                label={<FontIcon>delete</FontIcon>}
              />;
            }
            actionsComponent = <TableColumn>{editButton}{removeButton}</TableColumn>
          } else {
            if (claims.indexOf('Suspender_Medicamento') >= 0 && (!medicationEntry.suspended || !encounterEvent.publishDateTime)) {
              const label = state ? formatMessage({...messages.suspended}) : formatMessage({...messages.suspend});
              actionsComponent = <TableColumn>{<Switch type="switch" label={label} checked={state} onClick={submitFunction}/>}</TableColumn>;
            }
            else {
              actionsComponent = <TableColumn>{state ? formatMessage({...messages.suspended}) : ''}</TableColumn>;
            }
          }
          const days = firstEncounterEvent.publishDateTime ? Math.trunc((new Date() - new Date(firstEncounterEvent.publishDateTime))/1000/3600/24) : 0;
          if (show) {
            medicationsList.push(<TableRow key={`REQ-${medicationEntry.id}`}>
              <TableColumn ><span className='triangleOutside' ><span className='triangleInside' >{days}</span></span></TableColumn>
              <TableColumn>{medicationEntry.virtualMedicalProduct().name}</TableColumn>
              <TableColumn>{medicationEntry.posology}</TableColumn>
              <TableColumn>{medicationEntry.administrationNote}</TableColumn>
              <TableColumn>{encounterEvent.practitioner().name()}</TableColumn>
              {actionsComponent}
            </TableRow>);
          }
        }
      });
      // DILUTION
      medicationDilutionEntries.filter((value, index, self) => 
        self.findIndex((medicationEntry) => medicationEntry.guid === value.guid) === index).forEach((firstMedicationEntry) => {
        const firstEncounterEvent = firstMedicationEntry.encounterEvent();
        const medicationEntry = medicationDilutionEntries.slice(0).reverse().find((thisMedicationEntry) => thisMedicationEntry.guid === firstMedicationEntry.guid);
        const encounterEvent = medicationEntry.encounterEvent();
        let show = true;
        if (encounterEvent && !encounterEvent.deleted && encounterEvent.encounterId === encounterId) {
          const state = medicationEntry.suspended;
          let submitFunction = () => actions.suspendMedicationDilution(medicationEntry, activeEncounterEventId, activeUserId);
          if (state) {
            if ((new Date() - new Date(medicationEntry.startDateTime))/1000/3600 >=12) {
              show = false;
            }
            submitFunction = () => actions.unsuspendMedicationDilution(medicationEntry, activeEncounterEventId, activeUserId);
          }
          let actionsComponent = <TableColumn></TableColumn>;
          if (medicationEntry.encounterEventId === activeEncounterEventId && medicationEntry.id === firstMedicationEntry.id) {
            let editButton = '';
            let removeButton = '';
            if (claims.indexOf('Editar_Dilucion') >= 0) {
              editButton = <Button
                onClick={() => actions.prepare('IF', 1, 'form', 'medicationDilution', medicationEntry)}
                style={{}}
                label={<FontIcon>edit</FontIcon>}
              />;
            }
            if (claims.indexOf('Eliminar_Dilucion') >= 0) {
              removeButton = <Button
                onClick={() => actions.removeMedicationDilution(medicationEntry)}
                style={{}}
                label={<FontIcon>delete</FontIcon>}
              />;
            }
            actionsComponent = <TableColumn>{editButton}{removeButton}</TableColumn>
          } else {
            if (claims.indexOf('Suspender_Dilucion') >= 0 && (!medicationEntry.suspended || !encounterEvent.publishDateTime)) {
              const label = state ? formatMessage({...messages.suspended}) : formatMessage({...messages.suspend});
              actionsComponent = <TableColumn>{<Switch type="switch" label={label} checked={state} onClick={submitFunction}/>}</TableColumn>;
            }
            else {
              actionsComponent = <TableColumn>{state ? formatMessage({...messages.suspended}) : ''}</TableColumn>;
            }
          }
          const days = firstEncounterEvent.publishDateTime ? Math.trunc((new Date() - new Date(firstEncounterEvent.publishDateTime))/1000/3600/24) : 0;
          if (show) {
            medicationsList.push(<TableRow key={`DIL-${medicationEntry.id}`}>
              <TableColumn><span className='triangleOutside' ><span className='triangleInside' >{days}</span></span></TableColumn>
              <TableColumn>{medicationEntry.virtualMedicalProducts().map((product) => product.name).join('-')}</TableColumn>
              <TableColumn>{medicationEntry.posology}</TableColumn>
              <TableColumn>{medicationEntry.administrationNote}</TableColumn>
              <TableColumn>{encounterEvent.practitioner().name()}</TableColumn>
              {actionsComponent}
            </TableRow>);
          }
        }
      });
      // ALTERNATIVE
      medicationAlternativeEntries.filter((value, index, self) => 
        self.findIndex((medicationEntry) => medicationEntry.guid === value.guid) === index).forEach((firstMedicationEntry) => {
        const firstEncounterEvent = firstMedicationEntry.encounterEvent();
        const medicationEntry = medicationAlternativeEntries.slice(0).reverse().find((thisMedicationEntry) => thisMedicationEntry.guid === firstMedicationEntry.guid);
        const encounterEvent = medicationEntry.encounterEvent();
        let show = true;
        if (encounterEvent && !encounterEvent.deleted && encounterEvent.encounterId === encounterId) {
          const state = medicationEntry.suspended;
          let submitFunction = () => actions.suspendMedicationAlternative(medicationEntry, activeEncounterEventId, activeUserId);
          if (state) {
            if ((new Date() - new Date(medicationEntry.startDateTime))/1000/3600 >=12) {
              show = false;
            }
            submitFunction = () => actions.unsuspendMedicationAlternative(medicationEntry, activeEncounterEventId, activeUserId);
          }
          let actionsComponent = <TableColumn></TableColumn>;
          if (medicationEntry.encounterEventId === activeEncounterEventId && medicationEntry.id === firstMedicationEntry.id) {
            let editButton = '';
            let removeButton = '';
            if (claims.indexOf('Editar_Producto_No_Farmacologico') >= 0) {
              editButton = <Button
                onClick={() => actions.prepare('IF', 0, 'form', 'medicationAlternative', medicationEntry)}
                label={<FontIcon>edit</FontIcon>}
              />;
            }
            if (claims.indexOf('Eliminar_Producto_No_Farmacologico') >= 0) {
              removeButton = <Button
                onClick={() => actions.removeMedicationAlternative(medicationEntry)}
                label={<FontIcon>delete</FontIcon>}
              />;
            }
            actionsComponent = <TableColumn>{editButton}{removeButton}</TableColumn>
          } else {
            if (claims.indexOf('Suspender_Producto_No_Farmacologico') >= 0 && (!medicationEntry.suspended || !encounterEvent.publishDateTime)) {
              const label = state ? formatMessage({...messages.suspended}) : formatMessage({...messages.suspend});
              actionsComponent = <TableColumn>{<Switch type="switch" label={label} checked={state} onClick={submitFunction}/>}</TableColumn>;
            }
            else {
              actionsComponent = <TableColumn>{state ? formatMessage({...messages.suspended}) : ''}</TableColumn>;
            }
          }
          if (show) {
            productsList.push(<TableRow key={medicationEntry.id}>
              <TableColumn>{medicationEntry.product}</TableColumn>
              <TableColumn>{medicationEntry.routeAdministration().name}</TableColumn>
              <TableColumn>{`${medicationEntry.dose} ${formatMessage({...messages.each})} ${medicationEntry.doseFrecuency} ${formatMessage({...messages.hours})} ${formatMessage({...messages.by})} ${medicationEntry.doseDuration} ${formatMessage({...messages.days})}`}</TableColumn>
              <TableColumn>{medicationEntry.doseInstructions}</TableColumn>
              <TableColumn>{encounterEvent.practitioner().name()}</TableColumn>
              {actionsComponent}
            </TableRow>);
          }
        }
      });
      // MEDICATION SECTION
      let medicationContent = <div>{formatMessage({...messages.dontSee})}</div>;
      if (claims.indexOf('Ver_Procedimientos') >= 0) {
        medicationContent = formatMessage({...messages.defaultDrugs});
        if (medicationsList.length > 0) {
          medicationContent = <DataTable plain>
            <TableHeader>
              <TableRow>
                <TableColumn>{formatMessage({...messages.medicationTime})}</TableColumn>
                <TableColumn>{formatMessage({...messages.indication})}</TableColumn>
                <TableColumn>{formatMessage({...messages.medicationPosology})}</TableColumn>
                <TableColumn>{formatMessage({...messages.medicationSpecificIndications})}</TableColumn>
                <TableColumn>{formatMessage({...messages.claimant})}</TableColumn>
                <TableColumn>{formatMessage({...messages.actions})}</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicationsList}
            </TableBody>
          </DataTable>;
        }
      }
      const medicationSection =<div className='row'>
        <div className='col-xs-2'><b>{formatMessage({...messages.drugs})}:</b></div>
        <div className='col-xs-10'>{medicationContent}</div>
      </div>;
      // PRODUCT SECTION
      let productContent = <div>{formatMessage({...messages.dontSee})}</div>;
      if (claims.indexOf('Ver_Producto_No_Farmacologico') >= 0) {
        productContent = formatMessage({...messages.defaultNonDrugs});
        if (productsList.length > 0) {
          productContent = <DataTable plain>
            <TableHeader>
              <TableRow>
                <TableColumn>{formatMessage({...messages.indication})}</TableColumn>
                <TableColumn>{formatMessage({...messages.medicationRouteAdministration})}</TableColumn>
                <TableColumn>{formatMessage({...messages.medicationPosology})}</TableColumn>
                <TableColumn>{formatMessage({...messages.medicationSpecificIndications})}</TableColumn>
                <TableColumn>{formatMessage({...messages.claimant})}</TableColumn>
                <TableColumn>{formatMessage({...messages.actions})}</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productsList}
            </TableBody>
          </DataTable>;
        }
      }
      const productSection =<div className='row'>
        <div className='col-xs-2'><b>{formatMessage({...messages.nonDrugs})}:</b></div>
        <div className='col-xs-10'>{productContent}</div>
      </div>;

      // PROCEDURES SECTION
      const proceduresList = [];
      procedureEntries.filter((value, index, self) => 
        self.findIndex((procedureEntry) => procedureEntry.guid === value.guid) === index).forEach((firstProcedureEntry) => {
        const firstEncounterEvent = firstProcedureEntry.encounterEvent();
        const procedureEntry = procedureEntries.slice(0).reverse().find((thisProcedureEntry) => thisProcedureEntry.guid === firstProcedureEntry.guid);
        const encounterEvent = procedureEntry.encounterEvent();
        
        let show = true;
        if (encounterEvent && !encounterEvent.deleted && encounterEvent.encounterId === encounterId) {
          const state = procedureEntry.suspended;
          let submitFunction = () => actions.suspendProcedure(procedureEntry, activeEncounterEventId, activeUserId);
          if (state) {
            if ((new Date() - new Date(procedureEntry.startDateTime))/1000/3600 >= 12) {
              show = false;
            }
            submitFunction = () => actions.unsuspendProcedure(procedureEntry, activeEncounterEventId, activeUserId);
          }
          let actionsComponent = '';
          if (procedureEntry.encounterEventId === activeEncounterEventId && procedureEntry.id === firstProcedureEntry.id) {
            let editButton = <TableColumn></TableColumn>;
            let removeButton = '';
            if (claims.indexOf('Editar_Procedimientos') >= 0) {
              editButton = <Button
                onClick={() => actions.prepare('IP', 0, 'form', 'procedure', procedureEntry)}
                style={{fontSize: '20px'}}
                label={<FontIcon>edit</FontIcon>}
              />;
            }
            if (claims.indexOf('Eliminar_Procedimientos') >= 0) {
              removeButton = <Button
                onClick={() => actions.removeProcedure(procedureEntry)}
                style={{fontSize: '20px'}}
                label={<FontIcon>delete</FontIcon>}
              />;
            }
            actionsComponent = <TableColumn>{editButton}{removeButton}</TableColumn>
          } else {
            if (claims.indexOf('Suspender_Procedimientos') >= 0 && (!procedureEntry.suspended || !encounterEvent.publishDateTime)) {
              const label = state ? formatMessage({...messages.suspended}) : formatMessage({...messages.suspend});
              actionsComponent = <TableColumn>{<Switch type="switch" label={label} checked={state} onClick={submitFunction}/>}</TableColumn>;
            }
            else {
              actionsComponent = <TableColumn>{state ? formatMessage({...messages.suspended}) : ''}</TableColumn>;
            }
          }
          if (show) {
            proceduresList.push(<TableRow key={procedureEntry.id}>
              <TableColumn>{procedureEntry.procedure().name}</TableColumn>
              <TableColumn>{encounterEvent.practitioner().name()}</TableColumn>
              <TableColumn>{procedureEntry.role().name}</TableColumn>
              <TableColumn>{procedureEntry.sessionsQuantity}</TableColumn>
              <TableColumn>{procedureEntry.fundaments}</TableColumn>
              <TableColumn>{actionsComponent}</TableColumn>
            </TableRow>);
          }
        }
      });
      let procedureContent = <div>{formatMessage({...messages.dontSee})}</div>;
      if (claims.indexOf('Ver_Procedimientos') >= 0) {
        procedureContent = formatMessage({...messages.defaultProcedures});
        if (proceduresList.length > 0) {
          procedureContent = <DataTable plain>
            <TableHeader>
              <TableRow>
                <TableColumn>{formatMessage({...messages.indication})}</TableColumn>
                <TableColumn>{formatMessage({...messages.claimant})}</TableColumn>
                <TableColumn>{formatMessage({...messages.procedureTo})}</TableColumn>
                <TableColumn>{formatMessage({...messages.procedureSessions})}</TableColumn>
                <TableColumn>{formatMessage({...messages.procedureFundaments})}</TableColumn>
                <TableColumn>{formatMessage({...messages.actions})}</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proceduresList}
            </TableBody>
          </DataTable>;
        }
      }
      const procedureSection =<div className='row'>
        <div className='col-xs-2'><b>{formatMessage({...messages.procedures})}:</b></div>
        <div className='col-xs-10'>{procedureContent}</div>
      </div>;
      // ALERT SECTION
      const alertsList = [];
      alertEntries.filter((value, index, self) => 
        self.findIndex((alertEntry) => alertEntry.guid === value.guid) === index).forEach((firstAlertEntry) => {
        const firstEncounterEvent = firstAlertEntry.encounterEvent();
        const alertEntry = alertEntries.slice(0).reverse().find((thisAlertEntry) => thisAlertEntry.guid === firstAlertEntry.guid);        
        const encounterEvent = alertEntry.encounterEvent();
        if (encounterEvent && !encounterEvent.deleted && encounterEvent.encounterId === encounterId && (!alertEntry.archived || !encounterEvent.publishDateTime)) {
          const state = alertEntry.archived;
          let submitFunction = () => actions.suspendAlert(alertEntry, activeEncounterEventId, activeUserId);
          if (state) {
            submitFunction = () => actions.unsuspendAlert(alertEntry, activeEncounterEventId, activeUserId);
          }
          let actionsComponent = '';
          if (alertEntry.encounterEventId === activeEncounterEventId && alertEntry.id === firstAlertEntry.id) {
            let editButton = <TableColumn></TableColumn>;
            let removeButton = '';
            if (claims.indexOf('Editar_Alertas') >= 0) {
              editButton = <Button
                onClick={() => actions.prepare(null, null, 'alert', 'alert', alertEntry)}
                style={{fontSize: '20px'}}
                label={<FontIcon>edit</FontIcon>}
              />;
            }
            if (claims.indexOf('Eliminar_Alertas') >= 0) {
              removeButton = <Button
                onClick={() => actions.removeAlert(alertEntry)}
                style={{fontSize: '20px'}}
                label={<FontIcon>delete</FontIcon>}
              />;
            }
            actionsComponent = <div>{editButton}{removeButton}</div>
          } else {
            if (claims.indexOf('Archivar_Alertas') >= 0) {
              const label = state ? formatMessage({...messages.archived}) : formatMessage({...messages.archive});
              actionsComponent = <div>{<Switch type="switch" label={label} checked={state} onClick={submitFunction}/>}</div>;
            }
            else {
              actionsComponent = <div>{state ? formatMessage({...messages.suspended}) : ''}</div>;
            }
          }
          let timeSpan = firstEncounterEvent.publishDateTime ? Math.trunc((new Date() - new Date(firstEncounterEvent.publishDateTime))/1000/60) : 0;
          let timeLabel = formatMessage({...messages.minutes});
          if (timeSpan >= 60) {
            timeSpan = Math.trunc(timeSpan/60);
            timeLabel = formatMessage({...messages.hours});
            if (timeSpan >= 24){
              timeSpan = Math.trunc(timeSpan/24);
              timeLabel = formatMessage({...messages.days});
            }
          }
          alertsList.push(<ListItem key={alertEntry.id}
            primaryText={encounterEvent.practitioner().name()}
            secondaryText={alertEntry.observation}
            rightIcon={<div style={{textAlign: 'right'}}>{timeSpan} {timeLabel}<div></div>{actionsComponent}</div>}
            />
          );
        }
      });
      let alertContent = <div>{formatMessage({...messages.dontSee})}</div>;
      if (claims.indexOf('Ver_Alertas') >= 0) {
        alertContent = <div></div>;
        if (alertsList.length > 0) {
          alertContent = <List>
            {alertsList}
          </List>;
        }
      }
      let alertInput = <div></div>;
      if (claims.indexOf('Ingresar_Alertas') >= 0) {
        const disabledButton = !controls.alert.alert.observation;
        alertInput = <div>
          <TextField
            label={formatMessage({...messages.addNote})}
            style={{overflow:'scroll', width: '80%', float: 'left'}}
            value={controls.alert.alert.observation}
            onChange={(value) => {
              if (value.length <=250) {
                actions.controlsChanged({observation: value}, 'alert', 'alert');
              }
            }}
          />
          <Button 
            style={{height: '70px', width:'20%', float: 'left', color: disabledButton ? 'gray' : 'darkOrange'}}
            label={controls.alert.alert.id ? formatMessage({...messages.update}) : formatMessage({...messages.add})}
            disabled={disabledButton}
            onClick={() => controls.alert.alert.id ? actions.editAlert(controls.alert.alert) : actions.addAlert(activeEncounterEventId, encounterId, activeUserId, controls.alert.alert)}
          />
        </div>;
      }
      const alertSection =<div className='row'>
        {formatMessage({...messages.alerts})}
        {alertContent}
        {alertInput}
      </div>;
      // SHIFT CHANGE SECTION
      const shiftChangesList = [];
      shiftChangeEntries.filter((value, index, self) => 
        self.findIndex((shiftChangeEntry) => shiftChangeEntry.guid === value.guid) === index).forEach((firstShiftChangeEntry) => {
        const firstEncounterEvent = firstShiftChangeEntry.encounterEvent();
        const shiftChangeEntry = shiftChangeEntries.slice(0).reverse().find((thisShiftChangeEntry) => thisShiftChangeEntry.guid === firstShiftChangeEntry.guid);
        const encounterEvent = shiftChangeEntry.encounterEvent();
        if (encounterEvent && !encounterEvent.deleted && encounterEvent.encounterId === encounterId && (!shiftChangeEntry.archived || !encounterEvent.publishDateTime)) {
          const state = shiftChangeEntry.archived;
          let submitFunction = () => actions.suspendShiftChange(shiftChangeEntry, activeEncounterEventId, activeUserId);
          if (state) {
            submitFunction = () => actions.unsuspendShiftChange(shiftChangeEntry, activeEncounterEventId, activeUserId);
          }
          let actionsComponent = '';
          if (shiftChangeEntry.encounterEventId === activeEncounterEventId && shiftChangeEntry.id === firstShiftChangeEntry.id) {
            let editButton = <TableColumn></TableColumn>;
            let removeButton = '';
            if (claims.indexOf('Editar_Cambio_Turno') >= 0) {
              editButton = <Button
                onClick={() => actions.prepare(null, null, 'shiftChange', 'shiftChange', shiftChangeEntry)}
                style={{fontSize: '20px'}}
                label={<FontIcon>edit</FontIcon>}
              />;
            }
            if (claims.indexOf('Eliminar_Cambio_Turno') >= 0) {
              removeButton = <Button
                onClick={() => actions.removeShiftChange(shiftChangeEntry)}
                style={{fontSize: '20px'}}
                label={<FontIcon>delete</FontIcon>}
              />;
            }
            actionsComponent = <div>{editButton}{removeButton}</div>
          } else {
            if (claims.indexOf('Archivar_Cambio_Turno') >= 0) {
              const label = state ? formatMessage({...messages.archived}) : formatMessage({...messages.archive});
              actionsComponent = <div>{<Switch type="switch" label={label} checked={state} onClick={submitFunction}/>}</div>;
            }
            else {
              actionsComponent = <div>{state ? formatMessage({...messages.archived}) : ''}</div>;
            }
          }
          let timeSpan = firstEncounterEvent.publishDateTime ? Math.trunc((new Date() - new Date(firstEncounterEvent.publishDateTime))/1000/60) : 0;
          let timeLabel = formatMessage({...messages.minutes});
          if (timeSpan >= 60) {
            timeSpan = Math.trunc(timeSpan/60);
            timeLabel = formatMessage({...messages.hours});
            if (timeSpan >= 24){
              timeSpan = Math.trunc(timeSpan/24);
              timeLabel = formatMessage({...messages.days});
            }
          }
          shiftChangesList.push(<ListItem key={shiftChangeEntry.id}
            primaryText={encounterEvent.practitioner().name()}
            secondaryText={shiftChangeEntry.observation}
            rightIcon={<div style={{textAlign: 'right'}}>{timeSpan} {timeLabel}<div></div>{actionsComponent}</div>}
            />
          );
        }
      });
      let shiftChangeContent = <div>{formatMessage({...messages.dontSee})}</div>;
      if (claims.indexOf('Ver_Cambio_Turno') >= 0) {
        shiftChangeContent = <div></div>;
        if (shiftChangesList.length > 0) {
          shiftChangeContent = <List>
            {shiftChangesList}
          </List>;
        }
      }
      let shiftChangeInput = <div></div>;
      if (claims.indexOf('Ingresar_Cambio_Turno') >= 0) {
        const disabledButton = !controls.shiftChange.shiftChange.observation;
        shiftChangeInput = <div>
          <TextField
            label={formatMessage({...messages.addNote})}
            style={{overflow:'scroll', width: '80%', float: 'left'}}
            value={controls.shiftChange.shiftChange.observation}
            onChange={(value) => {
              if (value.length <=250) {
                actions.controlsChanged({observation: value}, 'shiftChange', 'shiftChange');
              }
            }}
          />
          <Button 
            style={{height: '70px', width:'20%', float: 'left', color: disabledButton ? 'gray' : 'darkOrange'}}
            label={controls.shiftChange.shiftChange.id ? formatMessage({...messages.update}) : formatMessage({...messages.add})}
            disabled={disabledButton}
            onClick={() => controls.shiftChange.shiftChange.id ? actions.editShiftChange(controls.shiftChange.shiftChange) : actions.addShiftChange(activeEncounterEventId, encounterId, activeUserId, controls.shiftChange.shiftChange)}
          />
        </div>;
      }
      const shiftChangeSection = <div
        ref={(node) => node && heights.shiftChange !== node.offsetHeight ? actions.changeHeight('shiftChange', node.offsetHeight) : null} 
        className='col-md-6' 
        style={{paddingTop: '24px', minHeight: heightObservation}}
      >
          {formatMessage({...messages.turnSwitchNote})}
          {shiftChangeContent}
          {shiftChangeInput}
        </div>;
      // DIAGNOSIS SECTION
      const diagnosesList = [];
      diagnosisEntries.forEach((firstDiagnosisEntry) => {
        const firstEncounterEvent = firstDiagnosisEntry.encounterEvent();
        const diagnosisEntry = diagnosisEntries.slice(0).reverse().find((thisDiagnosisEntry) => thisDiagnosisEntry.guid === firstDiagnosisEntry.guid);
        const encounterEvent = diagnosisEntry.encounterEvent();
        const state = diagnosisEntry.archived;
        let submitFunction = () => actions.suspendDiagnosis(diagnosisEntry, activeEncounterEventId, activeUserId);
        if (state) {
          submitFunction = () => actions.unsuspendDiagnosis(diagnosisEntry, activeEncounterEventId, activeUserId);
        }
        let actionsComponent, diagnosisState;
        if (diagnosisEntry.encounterEventId === activeEncounterEventId && diagnosisEntry.id === diagnosisEntries.find((thisProcedureEntry) => thisProcedureEntry.guid === diagnosisEntry.guid).id) {
          let editButton = <TableColumn></TableColumn>;
          let removeButton = '';
          if (claims.indexOf('Editar_Diagnostico') >= 0) {
            editButton = <Button
              onClick={() => {
                const diagnosis = diagnosisEntry.diagnosis();
                actions.prepare('DG', null, 'form', 'diagnosis', diagnosisEntry, {diagnosis: diagnosis, searchCode: diagnosis.standarCode, searchText: diagnosis.name});
              }}
              style={{fontSize: '20px'}}
              label={<FontIcon>edit</FontIcon>}
            />;
          }
          if (claims.indexOf('Eliminar_Diagnostico') >= 0) {
            removeButton = <Button
              onClick={() => actions.removeDiagnosis(diagnosisEntry)}
              style={{fontSize: '20px'}}
              label={<FontIcon>delete</FontIcon>}
            />;
          }
          actionsComponent = <TableColumn>{editButton}{removeButton}</TableColumn>;
          diagnosisState = diagnosisEntry.diagnosisState().name;
        } else {
          diagnosisState = <SelectField
          menuItems={diagnosisStates}
          itemLabel="name"
          fullWidth={true}
          position='below'
          itemValue="id"
          value={diagnosisEntry.diagnosisEntryStateId}
          onChange = {(value) => actions.controlsChanged({diagnosisEntryStateId: value}, 'diagnosis')}
        />
          if (claims.indexOf('Archivar_Diagnostico') >= 0 && (!diagnosisEntry.suspended || !encounterEvent.publishDateTime)) {
            const label = state ? formatMessage({...messages.suspended}) : formatMessage({...messages.suspend});
            actionsComponent = <TableColumn>{<Switch type="switch" label={label} checked={state} onClick={submitFunction}/>}</TableColumn>;
          }
          else {
            actionsComponent = <TableColumn>{state ? formatMessage({...messages.suspended}) : ''}</TableColumn>;
          }
        }
        const date = firstEncounterEvent.publishDateTime ? new Date(firstEncounterEvent.publishDateTime).toLocaleDateString() : '';
        diagnosesList.push(<TableRow key={diagnosisEntry.id}>
          <TableColumn><FontIcon>star</FontIcon></TableColumn>
          <TableColumn>{diagnosisEntry.name()}</TableColumn>
          <TableColumn>{diagnosisState}</TableColumn>
          <TableColumn>{date}</TableColumn>
          <TableColumn>{diagnosisEntry.isGes ? 'GES' : ''}</TableColumn>
          <TableColumn>{diagnosisEntry.isMorbidity ? 'ENO' : ''}</TableColumn>
          <TableColumn>{actionsComponent}</TableColumn>
        </TableRow>);
      });
      let diagnosisContent = <div>{formatMessage({...messages.dontSee})}</div>;
      if (claims.indexOf('Ver_Diagnostico') >= 0) {
        diagnosisContent = formatMessage({...messages.defaultDiagnosis});
        if (diagnosesList.length > 0) {
          diagnosisContent = <DataTable plain>
            <TableBody>
              {diagnosesList}
            </TableBody>
          </DataTable>;
        }
      }
      const diagnosisSection = <Card style={{margin: '10px 0', background: observationBackgroundColor, opacity: observationOpacity}}>
        <CardText style={{padding: '0px 16px', fontSize: '13px'}}>
          <EncounterEventsSectionTitle formatMessage={formatMessage} title={formatMessage({...messages.diagnosis})} encounterEvent={lastEncounterEvent}/> 
          {diagnosisContent}
        </CardText>
      </Card>;
      // REFERRAL SECTION
      const referralsList = [];
      referralEntries.filter((value, index, self) => 
        self.findIndex((referralEntry) => referralEntry.guid === value.guid) === index).forEach((firstDiagnosisEntry) => {
        const firstEncounterEvent = firstDiagnosisEntry.encounterEvent();
        const referralEntry = referralEntries.slice(0).reverse().find((thisDiagnosisEntry) => thisDiagnosisEntry.guid === firstDiagnosisEntry.guid);
        const encounterEvent = referralEntry.encounterEvent();
        if (encounterEvent && !encounterEvent.deleted && encounterEvent.encounterId === encounterId && (!referralEntry.archived || !encounterEvent.publishDateTime)) {
          const state = referralEntry.archived;
          let submitFunction = () => actions.suspendDiagnosis(referralEntry, activeEncounterEventId, activeUserId);
          if (state) {
            submitFunction = () => actions.unsuspendDiagnosis(referralEntry, activeEncounterEventId, activeUserId);
          }
          let actionsComponent, referralState;
          if (referralEntry.encounterEventId === activeEncounterEventId && referralEntry.id === referralEntries.find((thisProcedureEntry) => thisProcedureEntry.guid === referralEntry.guid).id) {
            let editButton = <TableColumn></TableColumn>;
            let removeButton = '';
            if (claims.indexOf('Editar_Solicitud_Interconsulta') >= 0) {
              editButton = <Button
                onClick={() => actions.prepare('SI', null, 'form', 'referral', referralEntry)}
                style={{fontSize: '20px'}}
                label={<FontIcon>edit</FontIcon>}
              />;
            }
            if (claims.indexOf('Eliminar_Solicitud_Interconsulta') >= 0) {
              removeButton = <Button
                onClick={() => actions.removeReferral(referralEntry)}
                style={{fontSize: '20px'}}
                label={<FontIcon>delete</FontIcon>}
              />;
            }
            actionsComponent = <TableColumn>{editButton}{removeButton}</TableColumn>;
            referralState = referralEntry.referralState().name;
          } else {
            referralState = <SelectField
            menuItems={referralStates}
            itemLabel="name"
            fullWidth={true}
            position='below'
            itemValue="id"
            value={referralEntry.referralEntryStateId}
            onChange = {(value) => actions.controlsChanged({referralEntryStateId: value}, 'referral')}
          />
            if (claims.indexOf('Archivar_Solicitud_Interconsulta') >= 0 && (!referralEntry.suspended || !encounterEvent.publishDateTime)) {
              const label = state ? formatMessage({...messages.suspended}) : formatMessage({...messages.suspend});
              actionsComponent = <TableColumn>{<Switch type="switch" label={label} checked={state} onClick={submitFunction}/>}</TableColumn>;
            }
            else {
              actionsComponent = <TableColumn>{state ? formatMessage({...messages.suspended}) : ''}</TableColumn>;
            }
          }
          const referral = referralEntry.referral();
          const date = firstEncounterEvent.publishDateTime ? new Date(firstEncounterEvent.publishDateTime).toLocaleDateString() : '';
          referralsList.push(<TableRow key={referralEntry.id}>
            <TableColumn><FontIcon>star</FontIcon></TableColumn>
            <TableColumn>
              <div style={{color: 'lightGray'}}>{referral.name}</div>
              <div style={{color: 'lightGray'}}>{referral.standarCode}: {referralEntry.description} </div>
            </TableColumn>
            <TableColumn>{referralState}</TableColumn>
            <TableColumn>{date}</TableColumn>
            <TableColumn>{referralEntry.isGes ? 'GES' : ''}</TableColumn>
            <TableColumn>{referralEntry.isMorbidity ? 'ENO' : ''}</TableColumn>
            <TableColumn>{actionsComponent}</TableColumn>
          </TableRow>);
        }
      });
      let referralContent = <div>{formatMessage({...messages.dontSee})}</div>;
      if (claims.indexOf('Ver_Solicitud_Interconsulta') >= 0) {
        referralContent = formatMessage({...messages.defaultReferral});
        if (referralsList.length > 0) {
          referralContent = <DataTable plain>
            <TableBody>
              {referralsList}
            </TableBody>
          </DataTable>;
        }
      }
      const referralSection = <Card style={{margin: '10px 0', background: observationBackgroundColor, opacity: observationOpacity}}>
        <CardText style={{padding: '0px 16px', fontSize: '13px'}}>
          <EncounterEventsSectionTitle formatMessage={formatMessage} title={formatMessage({...messages.formSI})} encounterEvent={lastEncounterEvent}/> 
          {referralContent}
        </CardText>
      </Card>;
      // CONFIRM SECTION
      let encounterEventConfirmationSection = '';
      if (encounterEvents[0] && !encounterEvents[0].publishDateTime && !encounterEvents[0].deleted && !modals.confirmModal && !modals.cancelModal) {
        encounterEventConfirmationSection = <div style={{background: '#202020', color: 'white', position: 'fixed', bottom: '10px', height: '50px', width: '40%', lineHeight:'40px', zIndex: 20, padding: '3px 20px'}}>{formatMessage({...messages.confirmation})}
          <Button style={{color: 'lightGray', position: 'absolute', right: '100px', lineHeight:'40px'}} label={formatMessage({...messages.cancel})} onClick={() => actions.openModal('cancelModal')}/>
          <Button style={{color: 'white', position: 'absolute', right: '10px', lineHeight:'40px'}} label={formatMessage({...messages.confirm})} onClick={() => actions.openModal('confirmModal')}/>
        </div>;
      }
      let modal = '';
      if (modals.confirmModal) {
        modal = <EncounterEventConfirm formatMessage={formatMessage} encounterEvent={encounterEvents[0]} practitionerId={activeUserId} actions={actions}/>;
      }
      if (modals.cancelModal) {
        modal = <EncounterEventRemove formatMessage={formatMessage} encounterEvent={encounterEvents[0]} practitionerId={activeUserId} actions={actions}/>;
      }
      // LIST FORMS SECTION
      let formsList = [];
      let canListForms = false;
      if (listForms) {
        blankview = <div onClick={actions.listForms} style={{position: 'fixed', margin: '-72px -16px', width: '100%', height: '1500px', background:'white', opacity: '0.7', zIndex: 100}}></div>;
      }
      const addPermissions = {
        EV: claims.indexOf('Ingresar_Evolucion') >= 0,
        EX: false,
        RR: claims.indexOf('Ingresar_Reposo') >= 0 || claims.indexOf('ingresar_Regimen') >= 0,
        IF: claims.indexOf('Ingresar_Medicamento') >= 0 || claims.indexOf('ingresar_Dilucion') >= 0 || claims.indexOf('ingresar_Producto_No_Farmalogico') >= 0,
        IP: claims.indexOf('Ingresar_Procedimientos') >= 0,
        DG: claims.indexOf('Ingresar_Diagnostico') >= 0,
        SI: claims.indexOf('Ingresar_Solicitud_Interconsulta') >= 0,
        OA: false,
        SE: false
      };
      ['EV', 'EX', 'RR', 'IF', 'IP', 'DG', 'SI', 'OA', 'SE'].forEach((formCode) => {
        if (addPermissions[formCode]) {
          canListForms = true;
          if (listForms) {
            const formTitle = formatMessage({...messages[`form${formCode}`]});
            const shortTitle = formatMessage({...messages[`code${formCode}`]});
            formsList.push(<ListItem
              primaryText={<div style={{background: 'black', color: 'white', borderRadius:'8px', textAlign: 'center', padding: '2px 20px'}}>{formTitle}</div>} 
              rightAvatar={<Avatar style={{background: 'royalBlue'}}>{shortTitle}</Avatar>} 
              onClick={() => actions.openForm(formCode, activeEncounterEventId)}
            />);
          }
        } 
      });
      let listFormsButton = '';
      if (canListForms && !selectedForm) {
        listFormsButton = <Button
          style={{background: 'darkOrange', zIndex: 101}}
          floating
          secondary
          fixed
          onClick={actions.listForms}
        >create
        </Button>;
      }
      const taxNumber = currentPatient.preferredIdentifierCode;
      const numeral = taxNumber.substr(0,taxNumber.length - 1);
      const checker = taxNumber[taxNumber.length - 1];
      const strTaxNumber = `${numeral.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}-${checker}`;
      const header = <div className='md-background--primary' style={{width: '100%', position: 'fixed', zIndex: 12, marginTop: '-11px', marginLeft:'-16px', paddingLeft: '100px'}}>
        <div className='row' >
          <div className='col-xs-6'>
            <div style={{fontSize: '22px'}}>{sexSymbol} {currentPatient.completeName}</div>
            <div >{currentPatient.nickname ? <span><span style= {{color: '#9ED3CC'}}>{formatMessage({...messages.socialName})}:</span><span>{currentPatient.nickname} </span></span>: ''}
            <span style= {{color: '#9ED3CC'}}>RUN:</span> {strTaxNumber}</div>
          </div>
          <div className='row col-xs-6' style={{textAlign: 'center'}}>
            <div className='col-xs-3'>
              <div style={{color:'#9ED3CC'}}>{formatMessage({...messages.age})}</div>
              <div>{age}</div>
            </div>
            <div className='col-xs-3' style={{borderLeft: '1px solid #9ED3CC', height: '50px'}}>
              <div style={{color:'#9ED3CC'}}>{formatMessage({...messages.weight})}</div>
              <div>{currentPatient.weight ? currentPatient.weight : '-'}</div>
            </div>
            <div className='col-xs-3' style={{borderLeft: '1px solid #9ED3CC', height: '50px'}}>
              <div style={{color:'#9ED3CC'}}>{formatMessage({...messages.location})}</div>
              <div style={{fontSize:'11px'}}>{`${currentEncounter.hospitalDepartment.shortName} ${currentEncounter.room.shortName} ${currentEncounter.bed.shortName}`}</div>
            </div>
            <div className='col-xs-3' style={{borderLeft: '1px solid #9ED3CC', height: '50px'}}>
              <div style={{color:'#9ED3CC'}}>{timeUnit}</div>
              <div>{stay}</div>
              <div style={{color:'#9ED3CC'}}>{startEncounter.toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        <div><span style= {{color: '#9ED3CC'}}>{formatMessage({...messages.diagnosis})}:</span> {currentEncounter.diagnosis.name}</div>
      </div>
      const body = <div style={{width: '100%', marginTop:'50px', margin:'0px 0px 0px -5px', padding:'2px 10px', background: '#F2F2F2'}}>
        <h3 style={{color: 'gray'}}>
          { encounterEvents.length > 0 ? 
          <div><span className='primary-text'>{formatMessage({...messages.lastMeeting})} </span>
          <span>{formatMessage({...messages.lastUpdate})}: {new Date(encounterEvents[0].recordDateTime).toLocaleString()} {encounterEvents[0].practitioner().name()}</span></div> : 
          formatMessage({...messages.firstMeeting})}
        </h3>
        <Card style={{margin: '10px 0'}}>
        <CardText style={{padding: '0px 16px', fontSize: '13px'}}>
          <div className='row'>
            {observationSection}
            {shiftChangeSection}
          </div>
        </CardText>
      </Card>;
        <Card style={{margin: '10px 0'}}>
          <EncounterEventsSectionTitle formatMessage={formatMessage} title={formatMessage({...messages.physical})}/> 
          <CardText style={{padding: '0px 16px'}}>
            {physicalSection}
          </CardText>
        </Card>
        <Card style={{margin: '10px 0'}}>
          <EncounterEventsSectionTitle formatMessage={formatMessage} title={formatMessage({...messages.signs})}/> 
          <CardText style={{padding: '0px 16px'}}>
            {signSection}
          </CardText>
        </Card>
        <Card style={{margin: '10px 0'}}>
          <EncounterEventsSectionTitle formatMessage={formatMessage} title={formatMessage({...messages.indications})} /> 
          <CardText style={{padding: '0px 16px'}}>
            <div className='row'>
              <div className='col-md-6'>
                {restSection}
                {dietSection}
              </div>
              <div className='col-md-6'>
                {alertSection}
              </div>
            </div>
            {medicationSection}
            {productSection}
            {procedureSection}
          </CardText>
        </Card>
        {diagnosisSection}
        {referralSection}
        {orderSection}
        {testSection}
      </div>;
      let form = '';
      if (selectedForm) {
        let skipModal = true;
        let formContent = '';
        let disabledButton = true;
        let leftCardAction = '';
        let submitFunction, activeEntry, add, edit, payload;
        const allControls = {};
        let label = formatMessage({...messages[`form${selectedForm}`]});
        let editForm = null;
        switch (selectedForm) {
          case 'EV':
          activeEntry = activeObservationEntry;
          payload = controls.form.observation;
          editForm = 'observation';
          allControls[editForm] = payload;
          add = actions.addObservation;
          edit = actions.editObservation;
          disabledButton = controls.form.observation.notes.length < 5;
          leftCardAction = <Button 
              style={{padding: '0px'}}
              label={<span style={{fontSize:'20px', lineHeight: '37px'}}>
                <i className="fa fa-download" aria-hidden="true"></i>
              </span>} 
              onClick={() => {
                const originContainer = document.getElementById('notes');
                originContainer.select();
                actions.controlsChanged({saveTemplate: true}, 'observation');
            }}/>;
            formContent = <ObservationForm
              formatMessage={formatMessage}
              controls= {payload}
              actions={actions}
              templates={templates}
              activeUserId={activeUserId}
              activeFacilityId={activeFacilityId}
            />;
            break;
          case 'RR':
            if (selectedTab == 0) {
              activeEntry = activeRestEntry;
              payload = controls.form.rest;
              editForm = 'rest';
              allControls[editForm] = payload;
              add = actions.addRest;
              edit = actions.editRest;
              disabledButton = !(controls.form.rest.observation && controls.form.rest.restId);
              label = formatMessage({...messages.rest});
            } else {
              activeEntry = activeDietEntry;
              payload = controls.form.diet;
              editForm = 'diet';
              allControls[editForm] = payload;
              add = actions.addDiet;
              edit = actions.editDiet;
              disabledButton = !(controls.form.diet.observation && controls.form.diet.dietId);
              label = formatMessage({...messages.diet});
            }    
            formContent = <TabsContainer 
              panelClassName="md-grid" colored
              activeTabIndex={selectedTab}
              onTabChange={(newTabId) => actions.changeTab(newTabId)}
            >
              <Tabs tabId="simple-tab">
                <Tab label={formatMessage({...messages.rest})} disabled={ controls.form.diet.id || claims.indexOf('Ingresar_Reposo') == -1}>
                  <RestAndDietForm
                    selectorLabel={formatMessage({...messages.restLabel})}
                    options={rests}
                    formatMessage={formatMessage}
                    controls= {controls.form.rest}
                    actions={actions}
                    code='rest'
                  />
                </Tab>
                <Tab label={formatMessage({...messages.diet})} disabled={controls.form.rest.id || claims.indexOf('Ingresar_Regimen') == -1}>
                  <RestAndDietForm
                    selectorLabel={formatMessage({...messages.dietLabel})}
                    options={diets}
                    formatMessage={formatMessage}
                    controls= {controls.form.diet}
                    actions={actions}
                    code='diet'
                  />
                </Tab>
              </Tabs>
            </TabsContainer>;
            break;
          case 'IP':
            activeEntry = editingObject.form;
            payload = controls.form.procedure;
            editForm = 'procedure';
            allControls[editForm] = payload;
            add = actions.addProcedure;
            edit = actions.editProcedure;
            disabledButton = !(controls.form.procedure.healthCarePractitionerRoleId && controls.form.procedure.procedureId);
            label = formatMessage({...messages.procedure});
            formContent = <ProcedureForm
              encounterEventId={encounterEventId}
              formatMessage={formatMessage}
              controls= {controls.form.procedure}
              actions={actions}
              roles={roles}
              procedures={procedures}
              encounterId={encounterId}
              activeUserId={activeUserId}
            />; 
            break;
          case 'IF':
            switch (selectedTab) {
              case 0:
                activeEntry = editingObject.form;
                payload = controls.form.medicationRequest;
                editForm = 'medicationRequest';
                allControls['medicationRequest'] = payload;
                add = actions.addMedicationRequest;
                edit = actions.editMedicationRequest;
                disabledButton = !(controls.form.medicationRequest.virtualMedicalProduct && controls.form.medicationRequest.routeAdministrationId);
                label = formatMessage({...messages.medicationRequest});
                break;
              case 1:
                activeEntry = editingObject.form;
                payload = controls.form.medicationDilution;
                editForm = 'medicationDilution';
                allControls[editForm] = payload;
                add = actions.addMedicationDilution;
                edit = actions.editMedicationDilution;
                disabledButton = !(controls.form.medicationDilution.medicationDilutionRequestEntryDetail.length > 0 && controls.form.medicationDilution.posology);
                label = formatMessage({...messages.medicationDilution});
                break;
              case 2:
                activeEntry = editingObject.form;
                payload = controls.form.medicationAlternative;
                editForm = 'medicationAlternative';
                allControls[editForm] = payload;
                add = actions.addMedicationAlternative;
                edit = actions.editMedicationAlternative;
                disabledButton = !(controls.form.medicationAlternative.product 
                  && controls.form.medicationAlternative.routeAdministrationId
                  && controls.form.medicationAlternative.dose
                  && controls.form.medicationAlternative.doseFrecuency
                  && controls.form.medicationAlternative.doseDuration
                  && controls.form.medicationAlternative.doseInstructions
                  );
                label = formatMessage({...messages.medicationAlternative});
                break; 
            }
            formContent = <div>
              <div className='row'>
                <div className='col-md-3'>
                  {formatMessage({...messages.weight})}: 0 kg.
                </div>
                <div className='col-md-3'>
                  {formatMessage({...messages.height})}: 0 cms.
                </div>
                <div className='col-md-2'>
                  {formatMessage({...messages.bmi})}: 0
                </div>
                <div className='col-md-1'>
                <Button 
                  iconEl={<i className="fa fa-pencil" aria-hidden="true"></i>} />
                </div>
                <div className='col-md-3'>
                  <span>{formatMessage({...messages.lastUpdate})}: </span>
                </div>
              </div>
              <TabsContainer
                panelClassName="md-grid"
                activeTabIndex={selectedTab}
                onTabChange={(newTabId) => actions.changeTab(newTabId)}
              >
                <Tabs tabId="simple-tab">
                  <Tab label={formatMessage({...messages.medicationRequest})} disabled={controls.form.medicationDilution.id || controls.form.medicationAlternative.id || claims.indexOf('Ingresar_Medicamento') == -1}>
                    <MedicationRequestForm
                      routeAdministrations={routeAdministrations}
                      formatMessage={formatMessage}
                      controls= {controls.form.medicationRequest}
                      actions={actions}
                    />
                  </Tab>
                  <Tab label={formatMessage({...messages.medicationDilution})} disabled={controls.form.medicationRequest.id || controls.form.medicationAlternative.id || claims.indexOf('Ingresar_Dilucion') == -1}>
                    <MedicationDilutionForm
                      formatMessage={formatMessage}
                      controls= {controls.form.medicationDilution}
                      actions={actions}
                    />
                  </Tab>
                  <Tab label={formatMessage({...messages.medicationAlternative})} disabled={controls.form.medicationRequest.id || controls.form.medicationDilution.id  || claims.indexOf('Ingresar_Producto_No_Farmacologico') == -1}>
                    <MedicationAlternativeForm
                      routeAdministrations={routeAdministrations}
                      formatMessage={formatMessage}
                      controls= {controls.form.medicationAlternative}
                      actions={actions}
                    />
                  </Tab>
                </Tabs>
              </TabsContainer>
            </div>;
            break;
        case 'DG':
            activeEntry = editingObject.form;
            payload = controls.form.diagnosis;
            editForm = 'diagnosis';
            allControls[editForm] = payload;
            add = actions.addDiagnosis;
            edit = actions.editDiagnosis;
            disabledButton = !(controls.form.diagnosis.diagnosis && controls.form.diagnosis.description && controls.form.diagnosis.diagnosisEntryStateId);
            label = formatMessage({...messages.diagnosis});
            formContent = <DiagnosisForm
              encounterEventId={encounterEventId}
              formatMessage={formatMessage}
              controls= {payload}
              actions={actions}
              diagnosisStates={diagnosisStates}
              healthProblems={healthProblems}
              encounterId={encounterId}
              activeUserId={activeUserId}
            />; 
            break;
        case 'SI':
            activeEntry = editingObject.form;
            payload = controls.form.referral;
            editForm = 'referral';
            allControls[editForm] = payload;
            add = actions.addReferral;
            edit = actions.editReferral;
            disabledButton = !(controls.form.referral.referralType 
              && controls.form.referral.healthCarePractitionerMedicalSpecialtyId 
              && controls.form.referral.referralRequestReasonId
              && controls.form.referral.referralRequestPriorityId);
            label = formatMessage({...messages.referral});
            formContent = <ReferralForm
              encounterEventId={encounterEventId}
              formatMessage={formatMessage}
              controls= {payload}
              actions={actions}
              roles={roles}
              diagnosisEntries={diagnosisEntries}
              referralReasons={referralReasons}
              referralPriorities={referralPriorities}
              encounterId={encounterId}
              activeUserId={activeUserId}
            />; 
            break;
        }
        const okLabel = `${activeEntry && !activeEntry.encounterEvent().publishDateTime ? formatMessage({...messages.update}) : formatMessage({...messages.add})} ${label}`;
        let formLabel = '';
        if (editingObject.form) {
          Object.keys(editingObject.form).forEach((key)=> {
            if (payload[key] !== editingObject.form[key]) {
              skipModal = false;
              formLabel = formatMessage({...messages[`form${selectedForm}`]});
            }
          });
        } else {
          Object.keys(allControls).forEach( (instanceKey) => {
            Object.values(allControls[instanceKey]).forEach((value)=> {
              if (value !== false && value !== null && value !== '' && (!Array.isArray(value) || value.length > 0)) {
                skipModal = false;
                formLabel = formatMessage({...messages[`form${selectedForm}`]});
              }
            });
          })
        }
        submitFunction = () => add(encounterEventId, encounterId, activeUserId, payload);
        if (activeEntry && !activeEntry.encounterEvent().publishDateTime) { 
          submitFunction = () => edit(payload, editingObject.form);
        }
        const cleanForm = editForm ? () => actions.cleanEditForm(editForm) : actions.cleanForm;
        let formModal = '';
        if (modals.closeModal) {
          formModal = <CloseModal formatMessage={formatMessage} actions={actions} formLabel={formLabel}/>
        } else if(modals.cleanModal) {
          formModal = <CleanModal formatMessage={formatMessage} actions={actions} formLabel={formLabel} cleanForm={cleanForm}/>
        }
        form = <Form closeAction={() => skipModal ? actions.closeForm() : actions.openModal('closeModal')}
          title={formatMessage({...messages[`form${selectedForm}`]})}>
          {formContent}
          {formModal}
          <CardActions style= {{width: '100%'}}>
            <div style={{width:'25%'}}>
              {leftCardAction}
            </div>
            <div style={{width: '75%', textAlign: 'right', margin: '5px 0px'}}>
              <Button 
                raised
                onClick={() => skipModal ? actions.closeForm() : actions.openModal('closeModal')}
                label={formatMessage({...messages.cancel}).toUpperCase()} 
              />
              <Button
                raised
                disabled={disabledButton}
                onClick={submitFunction}
                style={{background: disabledButton ? 'gray' : 'darkOrange', color: 'white', marginLeft: '20px'}}
                label={okLabel.toUpperCase()}
              />
              <Button
                onClick={() => skipModal ? cleanForm : actions.openModal('cleanModal')}
                style={{fontSize: '20px'}}
                label={<FontIcon>delete</FontIcon>}
              />
            </div>
            {modal}
          </CardActions>
        </Form>;
      }
      content = <div>
        {blankview}
        {header}
        {modal}
        {encounterEventConfirmationSection}
        {listFormsButton}
        {form}
        <List 
          style={{background: 'transparent', zIndex: 101, width: 'auto', right: '10px', bottom: '70px', position: 'fixed'}}
        >
          {formsList}
        </List>
        <div style={{height: '50px'}}/>
        <TabsContainer panelClassName="md-grid" colored style={{width: '100%', marginRight: '-16px', marginLeft: '-16px'}}>
          <Tabs tabId="simple-tab" style={{position:'fixed', width:'100%', zIndex: '10'}}>
            <Tab label={formatMessage({...messages.summarize})}>
              {body}
              
            </Tab>
            <Tab label={formatMessage({...messages.antecedents})}>
              
            </Tab>
            <Tab label={formatMessage({...messages.history})}>
              
            </Tab>
            <Tab label={formatMessage({...messages.evaluation})}>
              
            </Tab>
            <Tab label={formatMessage({...messages.exit})}>
              
            </Tab>
          </Tabs>
        </TabsContainer>  
      </div>;
    }
    return content;
  }
}

const mapStateToProps = createStructuredSelector({
  objects: reselectObjects(),
  app: mapAppAction,
  encounterEvents: mapEncounterEventsAction,
});

function mapAppAction(state) {
  return state.get('app').toJS();
}

function mapEncounterEventsAction(state) {
  return state.get('encounterEvents').toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(encounterEventsActions, dispatch),
    changeRoute: (url) => dispatch(push(url))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EncounterEventsPage);
EncounterEventsPage.contextTypes ={
 intl:React.PropTypes.object.isRequired
}
