import React, { Component } from 'react'
import { render } from 'react-dom'
import Styles from './Styles'
import { Form, Field } from 'react-final-form'
import Checkbox from './Checkbox'
import Radio from './RadioField'
import TextField from './TodoField'

import { Query } from "react-apollo";
import gql from "graphql-tag";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const load = async () => {
  await sleep(2000)
  return {
    username: 'erikras',
    firstName: 'Erik'
  }
}


const onSubmit = async values => {
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}


class FinalForm extends Component {
  state = { data: {} }
  async componentDidMount() {
    this.setState({ loading: true })
    const data = await load()
    this.setState({ loading: false, data })
  }

render() {
  return (
    <Styles>
        <Form
          onSubmit={onSubmit}
          initialValues={this.state.data}
          render={({ handleSubmit, pristine, reset, submitting, values }) => {
            return (
              <form onSubmit={handleSubmit}>
                {this.state.loading && <div className="loading" />}
                <div>
                  <label>Username</label>
                  <Field
                    name="username"
                    component="input"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label>First Name</label>
                  <Field
                    name="firstName"
                    component="input"
                    placeholder="First Name"
                  />
                </div>
                <div className="buttons">
                  <button type="submit" disabled={submitting || pristine}>
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={reset}
                    disabled={submitting || pristine}>
                    Reset
                  </button>
                </div>
                <pre>{JSON.stringify(values, 0, 2)}</pre>
              </form>
            )
          }}
        />
      </Styles>
    )
  }

}


export default FinalForm;
