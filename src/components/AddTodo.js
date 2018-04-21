import React, { Component } from 'react';
import { Field } from 'react-final-form'
import Styles from './Styles';

export class AddTodo extends Component {

  render() {

    return (
      <div>
        <label>Add Todo</label>
        <Field
          name="addTodo"
          component="input"
          type="text"
          placeholder="What are you going to achieve?"
        />
      </div>
      )
  }
}

export default AddTodo;
