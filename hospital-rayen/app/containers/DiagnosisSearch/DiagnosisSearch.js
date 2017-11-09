/*
 *
 * DiagnosisSearch
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';

import Card from 'react-md/lib/Cards/Card';
import CardActions from 'react-md/lib/Cards/CardActions';
import Radio from 'react-md/lib/SelectionControls/Radio';
import TextField from 'react-md/lib/TextFields';
import Chip from 'react-md/lib/Chips';
import Button from 'react-md/lib/Buttons/Button';
import Autocomplete from 'react-md/lib/Autocompletes';

import { makeSelectDiagnosisSearchResults } from './selectors';
import messages from './messages';
import { addDiagnosis, getDiagnosis } from './actions';
import { showMessage } from 'containers/NotificationCenter/actions';

export class DiagnosisSearch extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this.handleInlineChange = this.handleInlineChange.bind(this);
    this.handleAutocomplete = this.handleAutocomplete.bind(this);
  }

  handleInlineChange = (e) => {
  }

  handleChange = (name, e) => {
    if (name === 'filterText') {
      this.props.onGetDiagnosis(e);
    }
    var change = {};
    change[name] = e;
  }

  isEmptyObject(obj) {
    for(var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  }

  handleAutocomplete(name, item) {
    if (item) {
    }
  }

  render() {
    const { inlineValue } = this.state;
    let results = this.props.results.diagnosesResults ? this.props.results.diagnosesResults : [];
    return (
      <div>
        <div className="md-grid" style={{minHeight: '400px'}}>
          <Radio
            id="inlineRadio1"
            inline
            name="inlineRadios"
            value="A"
            label="Enfermedades Frecuentes"
            className="md-cell md-cell--6"
            checked={inlineValue === 'A'}
          />
          <Radio
            id="inlineRadio2"
            inline
            name="inlineRadios"
            value="B"
            label="Todas"
            className="md-cell md-cell--6"
            checked={inlineValue === 'B'}
          />
          <TextField
            id="floatingCenterTitle"
            label="Código CIE"
            lineDirection="center"
            placeholder="Código CIE"
            className="md-cell md-cell--3"
          />
          {/* <TextField
            id="floatingCenterTitle"
            label="Nombre Diagnóstico"
            lineDirection="center"
            placeholder="Nombre Diagnóstico"
            className="md-cell md-cell--9"
          /> */}
          <Autocomplete
            id="diagnosis"
            label="Nombre Diagnóstico"
            placeholder="Nombre Diagnóstico"
            className="md-cell md-cell--9"
            filter={Autocomplete.caseInsensitiveFilter}
            dataLabel="name"
            data={results}
            value={this.state.filterText}
            onChange={this.handleChange.bind(this, 'filterText')}
            onAutocomplete={this.handleAutocomplete.bind(this, 'filterText')}
          />
          <TextField
            id="applicationDescription"
            label="Descripción del diagnóstico"
            rows={2}
            className="md-cell md-cell--12"
          />
          <div className="md-cell md-cell--12" style={{padding: '5px 10px 0 10px', color: '#8f989c', background: '#e9f8ff'}}>
            <p>Este diagnóstico esta clasificado como <b>ENO</b>. Notificar inmediatamente</p>
          </div>
          <Chip label="GES" className="md-cell md-cell--2" />
          <Button
            className="md-cell md-cell--6"
            flat
            primary
          >
            Imprimir Informe IPD
          </Button>
          <TextField
            id="floatingCenterTitle"
            label="Problema de Salud"
            lineDirection="center"
            placeholder="Problema de Salud"
            className="md-cell md-cell--12"
          />
        </div>
        <CardActions className="md-divider-border md-divider-border--top">
          <Button flat onClick={() => this.props.closeAction()}>
            Cancelar
          </Button>
          <Button
            flat
            secondary
            disabled={ this.isEmptyObject(this.state.selectedDiagnosis) }
            onClick={ () => this.props.onAddDiagnosis(this.state.selectedDiagnosis) }
          >
            Guardar diagnostico
          </Button>
        </CardActions>
      </div>
    );
  }
}

DiagnosisSearch.propTypes = {
  dispatch: PropTypes.func.isRequired,
  closeAction: React.PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  results: makeSelectDiagnosisSearchResults(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
    onGetDiagnosis: (e) => {
      dispatch(getDiagnosis(e));
    },
    onAddDiagnosis: (item) => {
      // MedicineSearch.props.closeAction();
      dispatch(addDiagnosis(item));
      dispatch(showMessage("Un medicamento ha sido añadido"));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisSearch);
