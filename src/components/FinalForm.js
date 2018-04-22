import React, { Component } from 'react';
import _ from 'lodash';
import Styles from './Styles';
import { Form } from 'react-final-form';
import AutoSave from './AutoSave';

import { Query, compose } from "react-apollo";
import gql from "graphql-tag";
import { graphql } from 'react-apollo';

import TodoField from './TodoField';
import {DEFAULT_MAX_TODOS, BLANK_TODO} from '../constants';

export const GET_TODOS = gql `
  query {
   feed {
      count
      todos {
        id
        title
        completedAt
      }
    }
  } 
`;

const UPDATE_TODO_TEXT_MUTATION = gql`
  mutation UpdateToDoTextMutation($title: String!, $id: ID!) {
    updateTodoText(title: $title, id: $id) {
      id
      title
    }
  }
`
const CREATE_TODO_MUTATION = gql`
  mutation CreateTodoMutation($title: String!) {
    createTodo(title: $title) {
      id
      title
    }
  }
`

let setInitialValues = (todoData) => {
  let initialVals = {};
  for (let i=0; i < todoData.length; i++ ) {
    initialVals[todoData[i].id] = todoData[i].title;
  }
  return initialVals;
}


class FinalForm extends Component {
  state = { 
    data: {}, 
    todoAdded: true,
    count: 0,
  }

  async componentDidMount() {
    this.setState({ loading: true })
    this.setState({ todoAdded: false})
    this.setState({ loading: false })
  }

  save = async values => {
  console.log('Saving', values);


    _.map(values, (val, key) => {
      const id = key;
      const title = val;
      console.log(`id: ${id}, title:${title}`); 

      if (id.includes(BLANK_TODO.id)) {
        console.log('Creating a new todo');
        //this is a new todo
        //don't run update
        this.props.createTodoMutation({
          variables: {
            id,
            title
          },
          optimisticResponse: {
            __typename: "Mutation",
            createTodo: {
              id: id,
              __typename: "title",
              title: title
            }
          },
          refetchQueries: [{ query: GET_TODOS }]
        });
        this.setState({todoAdded: false})
      }

      else {
        //an existing todo, do an update
        console.log('Updating an existing todo');
        console.log(`id: ${id}, title:${title}`); 
        this.props.updateToDoTextMutation({
          variables: {
            id,
            title,
          },
          optimisticResponse: {
            __typename: "Mutation",
            updateTodo: {
              title: title,
              id: id,
              createdAt: "0",
              __typename: "Todo",
              
            }
          },
          update: (store, { data: { updateTodo } }) => {
              // Read the data from our cache for this query.
            const data = store.readQuery({ query: GET_TODOS });
            // console.log("json:", JSON.stringify(data.feed.todos, 0, 2));
            // data.todos.pop()
            store.writeQuery({
              query: GET_TODOS,
              data
            });
          }
        });
      }
    });
  }

  _updateCacheAfterDelete = (store, deleteTodo, todoID) => {
    console.log(" in _updateCacheAfterDelete todoID", todoID);
    const data = store.readQuery({
      query: GET_TODOS,
    })
    // console.log(`data ${data.feed.todos.map(i=>i.id)}`)
    data.feed.todos.splice(0, data.feed.todos.length,...data.feed.todos.filter(i => i.id !== todoID));
    // console.log(`updatedTodos after filter ${data.feed.todos.map(i=>i.id)}`)
    store.writeQuery({
      query: GET_TODOS,
      data
    })
  }

  _updateCacheAfterComplete = (store, completedAt, todoID) => {
    // console.log('completedAtaaaaa:', JSON.stringify(completedAt));
    // console.log(" in _updateCacheAfterComplete todoID", todoID);
    // const data = store.readQuery({
    //   query: GET_TODOS,
    // })
    // //find the index of the completed todo
    // let completedTodoIndex = _.findIndex(data.feed.todos, { 'id': todoID });
    // console.log('completedTodoIndex', completedTodoIndex)
    
    // //set that todo to complete
    // data.feed.todos[completedTodoIndex].completedAt = completedAt;
    // console.log('data.feed.todos...dAt', data.feed.todos[completedTodoIndex].completedAt)

    // store.writeQuery({
    //   query: GET_TODOS,
    //   data
    // })
  }

  _updateCacheAfterCreate = (store, createTodo, todoID, title) => {
    console.log(" in _updateCacheAfterCreate todoID", title);

    // const data = store.readQuery({
    //   query: GET_TODOS,
    // })
    // // console.log(`data ${data.feed.todos.map(i=>i.id)}`)
    // data.feed.todos.push({id: todoID, title: title});
    // // console.log(`updatedTodos after filter ${data.feed.todos.map(i=>i.id)}`)
    // store.writeQuery({
    //   query: GET_TODOS,
    //   data
    // })
  }

  _renderAddTodoFields() {
    let AddTodos = [];
    for (let i = this.state.count; i < DEFAULT_MAX_TODOS; i++) {
      AddTodos.push(<TodoField 
        name={BLANK_TODO.title} 
        id={`${BLANK_TODO.id}${i}`} 
        key={`${BLANK_TODO.id}${i}`} 
        placeHolder={BLANK_TODO.placeHolder}
        completedAt={BLANK_TODO.completedAt}
        updateStoreAfterDelete={this._updateCacheAfterDelete}
        updateStoreAfterComplete={this._updateCacheAfterComplete}        
      />)
    }
    return AddTodos;
  }

  render() {
    return (
      <Query
        query={ GET_TODOS } 
        >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :</p>;
          
          return (
            <Styles>
              <Form
                onSubmit={this.save /* NOT USED, but required */}
                initialValues={setInitialValues(data.feed.todos)}
                subscription={{} /* No need to subscribe to anything */}
              >
                {() => (
                  <div className="form">
                    {//check if a new todo has just been created and don't update it
                    }
                    <AutoSave debounce={1000} save={this.save} />
                    {
                      _.map([..._.filter(data.feed.todos, {completedAt: BLANK_TODO.completedAt}),..._.filter(data.feed.todos, (todo) => todo.completedAt > BLANK_TODO.completedAt)],({id, title, completedAt}) => (
                      <TodoField 
                        title={title} 
                        id={id} 
                        key={id} 
                        completedAt={completedAt}
                        updateStoreAfterDelete={this._updateCacheAfterDelete}
                        updateStoreAfterComplete={this._updateCacheAfterComplete}
                        />
                      ))
                    }
                      
                    {this._renderAddTodoFields()}
                      
                  </div>
                )}            
              </Form>
            </Styles>
          );  
        }}
      </Query>
    )
  }

}

export default compose(
  graphql(UPDATE_TODO_TEXT_MUTATION, { name: 'updateToDoTextMutation' }),
  graphql(CREATE_TODO_MUTATION, { name: 'createTodoMutation' }),
  )(FinalForm)
