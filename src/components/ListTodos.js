import React, { Component} from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";
import _ from 'lodash';

import List, { ListItem, ListItemText } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import ImageIcon from '@material-ui/icons/Image';


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


const _renderTodos = (todos) => {
  return _.map(todos,({ id, title, completedAt }) => (
    <ListItem button key={id}>
        <Avatar>
          <ImageIcon />
        </Avatar>
      <ListItemText primary={title} secondary={completedAt.split("").splice(0,10).join("")} />
    </ListItem>       
  ));
}


const _renderNoTodos = (todos) => {
  return (
    <ListItem>
        <Avatar>
          <ImageIcon />
        </Avatar>
      <ListItemText primary="No Todos" secondary="Nice Work!" />
    </ListItem>       
  );
}



class ListTodos extends Component {

  render() {
    return (
      <Query
        query={ GET_TODOS } 
        >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :</p>;


          return (
            <List component="nav">
              Length: {data.feed.todos.length}
              {(data.feed.count===0)?
                _renderNoTodos()
                :_renderTodos(data.feed.todos)}
            </List>
          );
        }}
      </Query>
    )  
  }
}

export default ListTodos;
