/*
 *
 * MedicineList
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

import { makeSelectMedicineSearch } from 'containers/MedicineSearch/selectors';

export class MedicineList extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  constructor(props) {
    super(props);

  }
  render() {
    const getRows = this.props.allMeds.medicines.map((m, i) => (
        <TableRow key={i}>
          {/* <TableColumn>{m.time}</TableColumn> */}
          <TableColumn>{m.medicine.genericName}</TableColumn>
          <TableColumn>{m.posology}</TableColumn>
          <TableColumn>{m.obs}</TableColumn>
          <TableColumn>{m.doctor}</TableColumn>
          <TableColumn>21</TableColumn>
        </TableRow>
      ));


    if (!this.props.allMeds){
      return <p>Cargando</p>
    }
    return (
      <DataTable plain>
        <TableHeader>
          <TableRow>
            {/* <TableColumn>Tiempo</TableColumn> */}
            <TableColumn>Indicación</TableColumn>
            <TableColumn>Posología</TableColumn>
            <TableColumn>Observaciones</TableColumn>
            <TableColumn>Solicitante</TableColumn>
            <TableColumn>Estado</TableColumn>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getRows}
        </TableBody>
    </DataTable>
    );
  }
}

MedicineList.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  allMeds: makeSelectMedicineSearch(),
});


function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MedicineList);
