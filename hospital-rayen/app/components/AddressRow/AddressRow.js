/**
*
* AddressRow
*
*/

import React from 'react';

function AddressRow({ contact }) {
  return (
    <td>
      {`${contact.address_region}. ${contact.address_municipality}`}<br/>
          {`${contact.address_street} ${contact.address_number}. ${contact.address_apt}`}
    </td>
  );
}

export default AddressRow;
