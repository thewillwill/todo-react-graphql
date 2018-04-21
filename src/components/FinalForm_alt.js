import React, { Component } from 'react'
import _ from 'lodash';
import Styles from './Styles'
import { Form } from 'react-final-form'
import AutoSave from './AutoSave'

import { Query } from "react-apollo";
import gql from "graphql-tag";
import { graphql } from 'react-apollo'

import TodoField from './TodoField'

const GET_TODOS_QUERY = gql `
  query {
   feed {
      count
      todos {
        id
        title
      }
    }
  } 
`;

const UPDATE_TODO_MUTATION = gql`
  mutation UpdateTodoMutation($title: String!, $id: ID!) {
    updateTodo(title: $title, id: $id) {
      id
      title
    }
  }
`

class FinalForm extends Component {
  state = { 
    todoData: {},
    initialVals: {},
    loading: ''
  }

   _getLinksToRender = async () => {
    console.log(this.props.getTodosQuery);
    if (this.props)
    return this.props.getTodosQuery.feed.todos;
  }

  _setInitialValues = () => {
    const todoData = this.props.todoData;
    let initialVals = {};
    for (let i=0; i < todoData.length; i++ ) {
      initialVals[todoData[i].id] = todoData[i].title;
    }
    return initialVals;
  }

  async componentDidMount() {
    this.setState({ loading: true })
    this.setState({ todoData: this.props.getTodosQuery.feed.todos});
    this.setState({ loading: false })
  }

  save = async values => {
  console.log('Saving', values);
  const id = Object.keys(values)[0];; //just getting the first updated entry[0] for now
  const title = values[id]; //just getting the first updated entry[0] for now

  console.log(`id: ${id}, title:${title}`); 
  this.props.updateTodoMutation({
    variables: {
      id,
      title
    },
  });
  console.log("end of save function");
}

  render() {
    if (this.props.getTodosQuery && this.props.getTodosQuery.loading) {
      return <div>Loading</div>
    }

    if (this.props.getTodosQuery && this.props.getTodosQuery.error) {
      return <div>Error</div>
    }
    
    const todosToRender = this.state.todosList;

    return (
      <Styles>
        <Form
          onSubmit={this.save /* NOT USED, but required */}
          initialValues={this._setInitialValues()}
          subscription={{} /* No need to subscribe to anything */}
        >
          {() => (
            <div className="form">
              <AutoSave debounce={1000} save={this.save} />
            
            {_.map(todosToRender,({id, title}) => (
              <TodoField name={title} id={id} key={id}/>
              ))
            }

            </div>
          )}
        </Form>
      </Styles>
    )
  }

}
export default
  graphql(UPDATE_TODO_MUTATION, { name: 'updateTodoMutation' })(
    graphql(GET_TODOS_QUERY, { name: 'getTodosQuery' })(FinalForm)
  )