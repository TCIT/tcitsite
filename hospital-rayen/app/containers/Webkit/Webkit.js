/*
 *
 * Webkit
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Dexie from 'dexie';

import Fuse from 'fuse.js';
import _ from 'lodash';

import Card from 'react-md/lib/Cards/Card';
import TextField from 'react-md/lib/TextFields';
import SelectField from 'react-md/lib/SelectFields';
import Autocomplete from 'react-md/lib/Autocompletes';
import SelectionControlGroup from 'react-md/lib/SelectionControls/SelectionControlGroup';

import InitControlButton from 'components/InitControlButton';
import DiagnosisSearch from 'containers/DiagnosisSearch';
import DrugSearch from 'containers/DrugSearch';
import { selectDiagnosis } from './actions';
import makeSelectWebkit from './selectors';

export class Webkit extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
  }

  openActionDialog = (action) => {

    if (action === "DIAGNOSTICO") {

    }

    if (action === "FARMACOS") {

    }

  }

  closeActionDialog = () => {
  }

  handleChange = (name, e) => {
    if (name=="diagnosis" && e.length > 2){
      this.search(name, e);
    } else if (name=="drugs" && e.length > 2) {
      this.search(name, e);
    }
    var change = {};
    change[name] = e;
  }

  searchCache = (cacheName, query, args, typeSearch, stateName) => {
    /**
     * @param {string} cacheName - nombre de la base de datos del cache a obtener
     * @param {object[]} query - parametros de busqueda, deben coincidir
     * @param {string[]} args - array que define en que columnas se realizara la busqueda
     * @param {string} typeSearch - tipo de busqueda, los tipos aceptados son
     * @param {string} stateName - si el resultado debe poblar algun estado en react
     * @return {string[]} array de resultados
     */
    const that = this;
    let results = [];
    const db = new Dexie(cacheName).open().then(function(db) {
      // define table cache to search
      const table = db.table(cacheName);

      // search by arguments
      args.map(function(arg) {
        if (arg == "startsWithIgnoreCase") {
          table
            .where(arg)
            .startsWithIgnoreCase(query)
            .toArray(function(resultsArray) {
              results.push(_.map(resultsArray, arg));
            });
        } else
        if (arg == "equals") {
          table
            .where(arg)
            .equals(query)
            .toArray(function(resultsArray) {
              results.push(_.map(resultsArray, arg));
            });
        }
      });

      // set state if available
      if (stateName) {
        let stateResults = {}
        stateResults[stateName] = results
      }
    });
  }


  search = (tableName, query) => {
    const that = this;
    const db = new Dexie(tableName).open().then(function(db) {
      let table = db.table(tableName);
      if (tableName==="diagnosis")
        table
          .where('DESCRIPCION')
          .startsWithIgnoreCase(query)
          .toArray(function(diagnosisArray) {
            let results = _.map(diagnosisArray, 'DESCRIPCION');
          });
      else if (tableName==="drugs") {
        table
          .where('NOMBRE_COMERCIAL')
          .startsWithIgnoreCase(query)
          .toArray(function(diagnosisArray) {
            let results = _.map(diagnosisArray, 'NOMBRE_COMERCIAL');
            let resultsForm = _.map(diagnosisArray, 'VIA');
          });
      }
    });
  }

  render() {
    const {
      filterType,
      diagnosisResults,
      diagnosis,
      drugsResults,
      drugsForm,
      drugs,
      openActions,
      openDiagnosisSearch,
      openDrugsSearch,
    } = this.state;
    return (
      <div className="md-cell md-cell--8-desktop md-cell--2-desktop-offset md-cell--12-tablet" style={{paddingTop:'30px'}}>
        <h1>Webkit</h1>
        <Card className="md-grid">
          <h3 className="md-cell md-cell--12">Diagnosticos</h3>

          <Autocomplete
            id="diagnosis"
            label="Busqueda Diagnosticos"
            className="md-cell md-cell--12"
            filter={filterType}
            data={diagnosisResults}
            value={diagnosis}
            onChange={this.handleChange.bind(this, 'diagnosis')}
            onAutocomplete={this.handleChange.bind(this, 'diagnosis')}
          />
        </Card>
        <br />
        <Card className="md-grid">
          <h3 className="md-cell md-cell--12">Farmacos</h3>
          <Autocomplete
            id="drugs"
            label="Nombre Farmaco"
            className="md-cell md-cell--12"
            filter={filterType}
            data={drugsResults}
            value={drugs}
            onChange={this.handleChange.bind(this, 'drugs')}
            onAutocomplete={this.handleChange.bind(this, 'drugs')}
          />
          <SelectField
            id="drugForm"
            label="Via"
            placeholder="Selecciona una vía"
            menuItems={drugsForm}
            className="md-cell md-cell--6"
          />
          {/* <TextField
            id="drugsVia"
            placeholder="Via"
            className="md-cell md-cell--6"
          /> */}
        </Card>
        {/* open actions button*/}
        {openActions &&
          <InitControlButton openAction={this.openActionDialog} />
        }
        {/* open diagnosis search*/}
        {openDiagnosisSearch &&
          <DiagnosisSearch closeAction={this.closeActionDialog} />
        }
        {/* open drugs search*/}
        {openDrugsSearch &&
          <DrugSearch closeAction={this.closeActionDialog} />
        }
      </div>
    );
  }
}

Webkit.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  diagnosisList: makeSelectWebkit(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onSelectDiagnosis: (diagnosis) => {
      dispatch(selectDiagnosis(diagnosis));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Webkit);
