import React, { Component } from "react";
import { Field } from "react-final-form";
import gql from "graphql-tag";
import { graphql, compose } from "react-apollo";
import Button from "material-ui/Button";
import { Delete, CheckBoxOutlineBlank, CheckBox } from "@material-ui/icons/";

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
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.textInput = React.createRef();;
  }

  focusTextInput = () => {
    console.log('textInput:', this.textInput)
    if (this.textInput) {
      this.textInput.current.state.state.focus();
      console.log('this.textInput.focus', this.textInput.current.state.state)
    }
  };

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
    this.focusTextInput();
    const { id, title, completedAt } = this.props;
    //check if Todo is already completed
    //if already complete set it back to not complete
    let completedTime = completedAt > BLANK_TODO.completedAt?
                          BLANK_TODO.completedAt:
                          new Date().toISOString();
    
    console.log("markComplete()", completedTime);

    this.props.markCompleteMutation({
      variables: {
        id,
        completedAt: completedTime,
      },
      optimisticResponse: {
        __typename: "Mutation",
        markComplete: {
          id: id,
          title: title,
          completedAt: completedTime,
          __typename: "title"
        }
      },
      update: (store, { data: { completedTodo } }) => {
        // console.log("completed todo with ID: ", id);
        this.props.updateStoreAfterComplete(store, completedTime, id);
        this.setState({completedAt: completedTime})
      }
    });
  }

  render() {
    let { id, completedAt } = this.props;
    // console.log("completedAt for todo:", completedAt);
    const completed = completedAt > BLANK_TODO.completedAt;
    // console.log('render() completedAt', completedAt)

    return (
      <div>

        <div 
          //onClick={this.focusTextInput}
          onClick={!id.includes(BLANK_TODO.id)?this.markComplete: undefined}
        >
          <Field
            name={id}
            component="input"
            type="text"
            placeholder={BLANK_TODO.placeHolder}
            className={completed?"completed":"notComplete"}
            disabled={completed}
            ref={this.textInput}
          />
        </div>

        { //check if 'new' exists
          !id.includes(BLANK_TODO.id) && (
          <React.Fragment>
            <Button onClick={this.markComplete} color="primary">
              {completed?
                <CheckBox color="secondary" />:
                <CheckBoxOutlineBlank color="secondary" />}
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
