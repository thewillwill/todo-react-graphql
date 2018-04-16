import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

const taskPaperStyle = {
  width: '90%',
  align: 'center',
  margin: "0px auto"
}

const textFieldStyle = {
  width: '100%'
}

class Todo extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: 'bb',
    }
  }



  render() {

    return (
      <Paper style={taskPaperStyle}>
        <TextField 
            value={this.props.title}
            style={textFieldStyle}
            key= {this.props.id}
            onChange={(e) => this.setState({ inputValue: e.target.value })}
        >     
        </TextField>
      </Paper>
    );
  }

}

export default Todo;
