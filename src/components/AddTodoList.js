import React, { Component } from 'react';
import AddTodo from './AddTodo';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const NUM_ADD_TODOS = 2;

class AddTodoList extends Component {

  renderAddTodos() {
    console.log("Rendering AddTodos");

    let blankTodos = [];
    for (let i=0; i< NUM_ADD_TODOS; i++) {
      blankTodos.push(<AddTodo key={i}/>);
    }
    return blankTodos;
    
  }

  render() {
    return (
      <Query
        query={gql`
         {
          feed(orderBy: id_ASC) {
            todos {
              id
              title
            }
          }
        }
        `}
      >
        return { this.renderAddTodos() }   
      </Query>
    );
  }
}

export default AddTodoList;
