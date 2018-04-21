import React, { Component } from "react";
import "./App.css";
import CssBaseline from "material-ui/CssBaseline";

import TopBar from "./TopBar";
import Paper from "material-ui/Paper";
import { grey } from "material-ui/colors";

import FinalForm from "./FinalForm";


const paperStyle = {
  marginTop: 5,
  marginBottom: 5,
  marginRight: 10,
  marginLeft: 10
};

const listHeading = {
  textAlign: "center",
  color: grey[500]
};

class App extends Component {
  render() {
    return (
      <div>
        <CssBaseline />
        <TopBar />
        <Paper style={paperStyle}>
          <h1 style={listHeading}>Todo list</h1>
          <FinalForm />

        </Paper>
      </div>
    );
  }
}

export default App;
