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
import Radio from 'react-md/lib/SelectionControls/Radio';
import TextField from 'react-md/lib/TextFields';
import Chip from 'react-md/lib/Chips';
import Button from 'react-md/lib/Buttons/Button';

import {makeSelectDiagnosisSearch} from './selectors';
import messages from './messages';

export class DiagnosisSearch extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);
    this._handleInlineChange = this._handleInlineChange.bind(this);
  }

  _handleInlineChange(e) {
    // Basically how the `SelectionControlGroup` works
  }
  render() {
    const { inlineValue } = this.state;
    return (
      <Card className="modal-actions md-block-centered">
        <Button
          icon
          primary
          onClick={this.props.closeAction}
          style={{float: 'right', zIndex: '999999', marginTop: '-10px'}}
        >close
        </Button>
        <form className="md-grid">
          <h2><FormattedMessage {...messages.header} /></h2>
          <div className="md-cell md-cell--12" style={{padding: '0px', margin: '0px'}}>
            <Radio
              id="inlineRadio1"
              inline
              name="inlineRadios"
              value="A"
              label="Enfermedades Frecuentes"
              checked={inlineValue === 'A'}
            />
            <Radio
              id="inlineRadio2"
              inline
              name="inlineRadios"
              value="B"
              label="Todas"
              checked={inlineValue === 'B'}
            />
          </div>
          <TextField
            id="floatingCenterTitle"
            label="Código CIE"
            lineDirection="center"
            placeholder="Código CIE"
            className="md-cell md-cell--3"
          />
          <TextField
            id="floatingCenterTitle"
            label="Nombre Diagnóstico"
            lineDirection="center"
            placeholder="Nombre Diagnóstico"
            className="md-cell md-cell--9"
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
          <Button raised style={{marginRight: '20px'}}>Cancelar</Button>
          <Button raised primary>Agregar Diagnostico</Button>
        </form>
      </Card>
    );
  }
}

DiagnosisSearch.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  DiagnosisSearch: makeSelectDiagnosisSearch(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisSearch);
