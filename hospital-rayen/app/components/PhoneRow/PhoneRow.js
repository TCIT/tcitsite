/**
*
* PhoneRow
*
*/

import React from 'react';

function PhoneRow({ contact }) {
  return (
    <td>
      {contact.phones.map((item) => item.default ? item.number : '')}
    </td>
  );
}

export default PhoneRow;
