/*
 *
 * DiagnosisList
 *
 */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import DataTable from 'react-md/lib/DataTables/DataTable';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableBody from 'react-md/lib/DataTables/TableBody';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import Chip from 'react-md/lib/Chips';
import loremIpsum from 'lorem-ipsum';

import {makeSelectDiagnosisSearch} from 'containers/DiagnosisSearch/selectors';

export class DiagnosisList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }
  render() {
    const getRows = this.props.allDiags.diagnoses.map((m, i) => (
        <TableRow key={i}>
          {/* <TableColumn>{m.time}</TableColumn> */}
          <TableColumn>{m.name}</TableColumn>
          <TableColumn><Chip label="Hello, World" /></TableColumn>
          <TableColumn>08/07/2017</TableColumn>
          <TableColumn>GES</TableColumn>
          <TableColumn>ENO</TableColumn>
        </TableRow>
      ));


    if (!this.props.allDiags){
      return <p>Cargando</p>
    }
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            <TableColumn>Diagnostico</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Fecha</TableColumn>
            <TableColumn>Ges</TableColumn>
            <TableColumn>Eno</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getRows}
        </TableBody>
    </DataTable>
    );
  }
}

DiagnosisList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  allDiags: makeSelectDiagnosisSearch(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DiagnosisList);

