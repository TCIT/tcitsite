import React, { PureComponent } from 'react'
import TextField from 'react-md/lib/TextFields';

export default function textFieldRenderer(props) {
  const {
    input,
    meta: {
      error,
      touched,
    },
    ...others,
  } = props

  return (
    <TextField
      {...input}
      {...others}
      error={touched && !!error}
      errorText={error}
    />
  )
}
