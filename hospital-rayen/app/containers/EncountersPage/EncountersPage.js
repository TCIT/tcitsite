import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';

import Button from 'react-md/lib/Buttons/Button';
import { Card, CardText } from 'react-md';
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
import * as encountersActions from './actions';
import { FormattedMessage } from 'react-intl';
import NavigationDrawer from 'react-md/lib/NavigationDrawers';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import { FontIcon } from 'react-md';

export class EncountersPage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.actions.getEncounters(this.props.objects.sessions[this.props.app.activeSessionId].facilityId);
    
  }

  render() {
    const formatMessage = this.context.intl.formatMessage;
    const { actions, changeRoute, objects } = this.props;
    const activeSession = objects.sessions[this.props.app.activeSessionId];
    const activeFacility = activeSession.facility();
    const practitioners = Object.values(objects.users);
    const claims = activeSession.claims;
    const { controls, assignedEncounters } = this.props.encounters;
    const encounters = this.props.encounters.encounterIds.map((encounterId) => this.props.objects.encounters[encounterId]);
    const unassignedEncounters = encounters.filter((encounter)=> encounter.assignedHealthCarePractitionerId === 0);
    const ownEncounters = encounters.filter((encounter)=> encounter.assignedHealthCarePractitionerId === activeSession.userId);
    const ownEncountersLength =ownEncounters.length;
    let unassignedSection = '';
    let ownSection = '';
    let recoveredSection = '';
    let searchSection = '';
    if (ownEncountersLength !== assignedEncounters) {
      actions.setEncountersSubtitle(ownEncountersLength,formatMessage({...messages.title}),formatMessage({...messages.assignedPatients}));
    }
    if (controls.searchText) {
      const searchedEncounters = encounters.filter((encounter)=> encounter.patient().patientName.search(new RegExp(controls.searchText, 'i')) >= 0 || (encounter.patient().identifier.search(new RegExp(controls.searchText, 'i')) >= 0));
      searchSection = <EncountersTable
        formatMessage={formatMessage}
        actions={actions}
        claims={claims}
        practitioners={practitioners}
        encounters={searchedEncounters}
        title={`${formatMessage({...messages.searchedPatients})}(${searchedEncounters.length})`}
      />;
    } else {
      if (unassignedEncounters.length > 0) {
        unassignedSection = <EncountersTable
          formatMessage={formatMessage}
          actions={actions}
          claims={claims}
          practitioners={practitioners}
          encounters={unassignedEncounters}
          title={`${formatMessage({...messages.unassignedPatients})}(${unassignedEncounters.length})`}
        />;
      }
      if (ownEncountersLength > 0) {
        ownSection = <EncountersTable
          formatMessage={formatMessage}
          actions={actions}
          claims={claims}
          practitioners={practitioners}
          encounters={ownEncounters}
          title={`${formatMessage({...messages.ownPatients})}(${ownEncountersLength})`}
        />;
      }
    }
    return (
      <div>
        <Card style={{margin: '10px 0'}}>
          <CardText style={{padding: '7px 16px'}}>
            <TextField
              leftIcon={<i className="fa fa-search" aria-hidden="true"></i>}
              value = {controls.searchText} 
              placeholder= {formatMessage({...messages.searchPlaceholder})}
              onChange= {(value) => actions.controlsChanged({searchText: value})}
            />
          </CardText>
        </Card>
        {searchSection}
        {unassignedSection}
        <div onClick={actions.print}
        style={{textAlign:'right', textDecoration: 'underline dotted'}}><FontIcon>print</FontIcon></div>
        {ownSection}
        {recoveredSection}
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  objects: reselectObjects(),
  app: mapAppAction,
  encounters: mapEncountersAction,
});

function mapAppAction(state) {
  return state.get('app').toJS();
}

function mapEncountersAction(state) {
  return state.get('encounters').toJS();
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(encountersActions, dispatch),
    changeRoute: (url) => dispatch(push(url))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EncountersPage);
EncountersPage.contextTypes ={
 intl:React.PropTypes.object.isRequired
}
