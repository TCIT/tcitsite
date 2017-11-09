/*
 *
 * WebkitSearch
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { createStructuredSelector } from 'reselect';

import Card from 'react-md/lib/Cards/Card';

import InitControlButton from 'components/InitControlButton';
import DiagnosisSearch from 'containers/DiagnosisSearch';
import MedicineSearch from 'containers/MedicineSearch';
import ActionDialog from 'components/Form';
import MedicineList from 'containers/MedicineSearch/MedicineList';
import DiagnosisList from 'containers/DiagnosisSearch/DiagnosisList';

export class WebkitSearch extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
  }
  openActionDialog = (action) => {

    if (action === "DIAGNOSTICO") {
    }

    if (action === "FARMACOS") {
    }

  }

  closeActionDialog = () => {
  }

  render() {
    const {
      openActions,
      openDiagnosisSearch,
      openDrugsSearch,
    } = this.state;

    return (
      <div className="md-cell md-cell--10-desktop md-cell--1-desktop-offset md-cell--12-tablet" style={{paddingTop:'30px'}}>
        <Helmet
          title="WebkitSearch"
          meta={[
            { name: 'description', content: 'Description of WebkitSearch' },
          ]}
        />
        <h1>Filtros de busqueda</h1>
        <Card className="md-grid">
          <h3 className="md-cell md-cell--12">Farmacos</h3>
          <MedicineList />
        </Card>
        <br />
        <Card className="md-grid">
          <h3 className="md-cell md-cell--12">Diagnosticos</h3>
          <DiagnosisList />
        </Card>

        {/* open actions button*/}
        {openActions &&
          <InitControlButton openAction={this.openActionDialog} />
        }
        {/* open diagnosis search*/}
        {openDiagnosisSearch &&
          <ActionDialog
            closeAction={this.closeActionDialog}
            actionLabel="Agregar"
            title="Nuevo diagnóstico"
          >
            <DiagnosisSearch
              id="diagnostico"
              internalSearchOnly={true}
              minCharsToSearch={3}
              closeAction={this.closeActionDialog}
            />
          </ActionDialog>
        }
        {/* open drugs search*/}
        {openDrugsSearch &&
          <ActionDialog
            closeAction={this.closeActionDialog}
            actionLabel="Agregar"
            title="Indicaciones: Fármacos"
          >
            <MedicineSearch
              id="busqueda"
              internalSearchOnly={true}
              minCharsToSearch={3}
              closeAction={this.closeActionDialog}
            />
          </ActionDialog>
        }
      </div>
    );
  }
}

WebkitSearch.propTypes = {
  dispatch: PropTypes.func.isRequired,
};


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(WebkitSearch);
