/**
*
* LocaleToggle
*
*/

import React from 'react';
import SelectField from 'react-md/lib/SelectFields';

function Toggle(props) {

  return (
    <SelectField
      id="carriers2"
      menuItems={props.values}
      label={props.label}
      className="md-cell md-cell--12"
      value={props.value}
      onChange={props.onToggle}
    />
  );
}

Toggle.propTypes = {
  onToggle: React.PropTypes.func,
  values: React.PropTypes.array,
  value: React.PropTypes.string,
  messages: React.PropTypes.object,
};

export default Toggle;
