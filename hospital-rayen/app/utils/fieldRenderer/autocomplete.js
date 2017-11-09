import React, { PureComponent } from 'react'
import Autocomplete from 'react-md/lib/Autocompletes';

export default function autocompleteRenderer(props) {
  const {
    input,
    meta: {
      error,
      touched,
    },
    ...others,
  } = props

  return (
    <Autocomplete
      {...input}
      {...others}
      onAutocomplete={input.onChange}
      error={touched && !!error}
      errorText={error}
    />
  )
}
