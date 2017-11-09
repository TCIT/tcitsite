import React from 'react'
import { FormattedMessage } from 'react-intl'

const maxLength = length =>
  <FormattedMessage
    id="validation.maxLength"
    values={{ length }}
  />

const required = () =>
  <FormattedMessage
    id="validation.required"
  />

export default {
  maxLength,
  required,
}
