import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

const blankTodoPaper = {
  width: '90%',
  align: 'center',
  margin: "0px auto"
}

const blankTextField = {
  width: '100%'
}

class AddToDo extends Component {

  render() {
    return (
      <Paper style={blankTodoPaper}>
        <TextField 
            key = {_.uniqueId(['test'])}
            hintText="What are you going to acheive?"
            style={blankTextField}
            fullWidth={true}
            onChange={(e) => this.setState({ inputValue: e.target.value })}
        >
        </TextField>
      </Paper>
    );
  }
}

export default AddToDo;
