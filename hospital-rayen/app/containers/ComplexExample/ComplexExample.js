/*
 *
 * ComplexExample
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import ExpansionList from 'react-md/lib/ExpansionPanels/ExpansionList';

import TripNamePanel from 'components/TripNamePanel';
import DestinationsPanel from 'components/DestinationsPanel';
import TravelDatesPanel from 'components/TravelDatesPanel';
import CarrierPanel from 'components/CarrierPanel';
import MealPreferencesPanel from 'components/MealPreferencesPanel';

export class ComplexExample extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <ExpansionList style={{ padding: 16 }}>
        <TripNamePanel mobile={false} />
        <DestinationsPanel mobile={false} />
        <TravelDatesPanel mobile={false} />
        <CarrierPanel mobile={false} />
        <MealPreferencesPanel mobile={false} />
      </ExpansionList>
    );
  }
}

ComplexExample.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(ComplexExample);
