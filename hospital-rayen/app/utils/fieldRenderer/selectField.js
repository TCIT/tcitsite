import React, { PureComponent } from 'react'
import SelectField from 'react-md/lib/SelectFields';

export default function selectFieldRenderer(props) {
  const {
    input,
    meta: {
      error,
      touched,
    },
    ...others,
  } = props

  return (
    <SelectField
      {...input}
      {...others}
      error={touched && !!error}
      errorText={error}
    />
  )
}
