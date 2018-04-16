import React, { Component} from 'react';
import Todo from './Todo';
import _ from 'lodash';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';


const FILTER_BY_NAME = gql `
  query todo($todoText: String!){
   feed(filter: $todoText) {
      count
      todos {
        id
        title
      }
    }
  } 
`;


const renderTodos = (todos) => {
  return _.map(todos,({ id, title }) => (
          <Todo title={title} key={id}></Todo>
        ));
}


class ToDoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      todoText: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});

    _.debounce(() => {alert('A name was submitted: ' + event.target.value)}, 300);

  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    this.setState({value: event.target.value});
    this.setState({todoText: this.state.value})
  }


  render() {
    const filterTodos = _.debounce((term) => {this.handleSubmit(term)}, 300);
    return (
      <Query
        query={ FILTER_BY_NAME } 
        variables={{todoText: this.state.todoText}}
        >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :</p>;


          return (
          <div>
            <TextField variant="raised" color="primary" value={this.state.value} onChange={event => filterTodos(event)}>
              Hello World
            </TextField>
            <Button
              onClick={this.handleSubmit}>
              Filter
            </Button>
            Length: {data.feed.todos.length}
            {(data.feed.count===4)?renderTodos(data.feed.todos):"No Todos found"}
          </div>
          );
        }}
      </Query>
    )  
  }
}

export default ToDoList;
