import React, { Fragment } from 'react';

const ToDoFragment  = ({name, label}) => (
  <Fragment>
    <div>
      <label>{label} Street</label>
      <Field
        name={`${name}.street`}
        component="input"
        placeholder={`${label} Street`}
      />
    </div>
    <div>
      <label>{label} City</label>
      <Field
        name={`${name}.city`}
        component="input"
        placeholder={`${label} City`}
      />
    </div>
    <div>
      <label>{label} Postal Code</label>
      <Field
        name={`${name}.postalCode`}
        component="input"
        placeholder={`${label} Postal Code`}
      />
    </div>
  </Fragment>
)
