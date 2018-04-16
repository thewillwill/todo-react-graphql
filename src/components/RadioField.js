import React from 'react'
import Radio from 'material-ui/Radio'

export default ({
  input: { checked, value, name, onChange, ...restInput },
  meta,
  ...rest
}) => (
  <Radio
    {...rest}
    name={name}
    inputProps={restInput}
    onChange={onChange}
    checked={!!checked}
    value={value}
  />
)
