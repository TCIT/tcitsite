/* Header.jsx */
import React from 'react';
import TableHeader from 'react-md/lib/DataTables/TableHeader';
import TableRow from 'react-md/lib/DataTables/TableRow';
import TableColumn from 'react-md/lib/DataTables/TableColumn';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

const cn = 'md-table-column--adjusted';
const Header = () => (
  <TableHeader>
    <TableRow>
      <TableColumn className={cn}>{<FormattedMessage {...messages.fullname} />}</TableColumn>
      <TableColumn className={cn}>{<FormattedMessage {...messages.email} />}</TableColumn>
      <TableColumn className={cn}>{<FormattedMessage {...messages.phone} />}</TableColumn>
      <TableColumn className={cn}>{<FormattedMessage {...messages.actions} />}</TableColumn>
    </TableRow>
  </TableHeader>
);

export default Header;
