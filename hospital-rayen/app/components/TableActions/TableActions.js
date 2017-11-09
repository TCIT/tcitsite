/* TableActions.jsx */
import React, { PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';
import Button from 'react-md/lib/Buttons/Button';
import MenuButton from 'react-md/lib/Menus/MenuButton';
import ListItem from 'react-md/lib/Lists/ListItem';
import TableCardHeader from 'react-md/lib/DataTables/TableCardHeader';
import messages from './messages';

const TableActions = ({ count, removeSelected }) => (
  <TableCardHeader
    title={<FormattedMessage {...messages.title} />}
    visible={count > 0}
    className={`${count > 0 ? 'action-table-selected' : 'action-table-unselected'}`}
    contextualTitle={`${count} contacto${count > 1 ? 's' : ''} seleccionado`}
    actions={[
      <Button key="delete" icon onClick={removeSelected} tooltipLabel={<FormattedMessage {...messages.buttonactiondelete} />} tooltipDelay={300} tooltipPosition="left">delete</Button>,
    ]}
  >
  </TableCardHeader>
);

TableActions.propTypes = {
  count: PropTypes.number.isRequired,
  removeSelected: PropTypes.func.isRequired,
};

export default TableActions;
