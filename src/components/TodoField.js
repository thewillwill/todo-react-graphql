import React, { Component } from "react";
import { Field } from "react-final-form";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Button from "material-ui/Button";
import { Delete, CheckBoxOutlineBlank } from "@material-ui/icons/";

import { BLANK_TODO } from "../constants";

const DELETE_TODO_MUTATION = gql`
  mutation DeleteTodoMutation($id: ID!) {
    deleteTodo(id: $id) {
      id
      title
    }
  }
`;

const MARK_COMPLETE_MUTATION = gql`
  mutation MarkCompleteMutation($id: ID!, $completedAt: DateTime!) {
    markComplete(id: $id, completedAt: $completedAt) {
      id
      title
      completedAt
    }
  }
`;

export class TodoField extends Component {
  removeTodo = async () => {
    let { id, title } = this.props;
    this.props.deleteTodoMutation({
      variables: {
        id
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteTodo: {
          id: id,
          title: title,
          __typename: "title"
        }
      },
      update: (store, { data: { deletedTodo } }) => {
        console.log("deleted todo with ID: ", id);
        this.props.updateStoreAfterDelete(store, deletedTodo, id);
      }
    });
  };

  markComplete = async () => {
    const { id, title } = this.props;
    const completedAt = new Date().toISOString();
    console.log("markComplete()", completedAt);

    this.props.markCompleteMutation({
      variables: {
        id,
        completedAt
      },
      optimisticResponse: {
        __typename: "Mutation",
        markComplete: {
          id: id,
          title: title,
          completedAt: completedAt,
          __typename: "title"
        }
      },
      update: (store, { data: { completedTodo } }) => {
        console.log("completed todo with ID: ", id);
        this.props.updateStoreAfterComplete(store, completedAt, id);
      }
    });
    
console.log('L78')
  }

  render() {
    let { id, title, completedAt } = this.props;
    console.log("completedAt for todo:", completedAt);
    return (
      <div>
        <label>{completedAt} </label>
        <Field
          name={id}
          component="input"
          type="text"
          placeholder={BLANK_TODO.placeHolder}
        />

        {id !== BLANK_TODO.id && (
          <React.Fragment>
            <Button onClick={this.markComplete} color="primary">
              <CheckBoxOutlineBlank color="secondary" />
            </Button>

            <Button onClick={this.removeTodo} color="primary">
              <Delete color="primary" />
            </Button>
          </React.Fragment>
        )}
      </div>
    );
  }
}
export default compose(
  graphql(DELETE_TODO_MUTATION, { name: "deleteTodoMutation" }),
  graphql(MARK_COMPLETE_MUTATION, { name: "markCompleteMutation" })
)(TodoField);
